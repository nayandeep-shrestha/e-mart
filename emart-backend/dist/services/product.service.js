"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProducts = exports.updateProductById = exports.getProductById = exports.deleteProduct = exports.createProduct = void 0;
const client_1 = require("@prisma/client");
const product_mapper_1 = require("../mappers/product.mapper");
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const firebaseUpload_1 = require("../utils/firebaseUpload");
const update_utils_1 = require("../utils/update.utils.");
const firebase_1 = require("../firebase");
const prisma = new client_1.PrismaClient();
// create Product
const createProduct = (input, imageList, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId, name, description, quantity, categoryId, price, code, tags, piece, bora, carton, kg } = input;
    if (!storeId)
        throw new http_exception_model_1.default(400, "Store id can't be blank");
    const checkStoreUser = yield prisma.stores.findUnique({
        where: {
            id: Number(storeId),
            userId
        },
    });
    if (!checkStoreUser)
        throw new http_exception_model_1.default(404, "Store not found");
    if (!name)
        throw new http_exception_model_1.default(400, "Product name can't be blank");
    if (!description)
        throw new http_exception_model_1.default(400, "Description can't be blank");
    if (!price)
        throw new http_exception_model_1.default(400, "Price can't be blank");
    if (!quantity)
        throw new http_exception_model_1.default(400, "Product quantity can't be blank");
    if (!code)
        throw new http_exception_model_1.default(400, "Code can't be blank");
    const checkCode = yield prisma.details.findUnique({
        where: { code }
    });
    if (checkCode)
        throw new http_exception_model_1.default(409, "The code already exist");
    if (categoryId.length === 0)
        throw new http_exception_model_1.default(400, "Category id can't be blank");
    let categoryIds = categoryId.map((item) => Number(item));
    const category = yield prisma.categories.findMany({
        where: {
            id: {
                in: categoryIds,
            },
        },
    });
    if (!category)
        throw "Category not found";
    const imageUrls = yield (0, firebaseUpload_1.imageUploadToFirebase)(imageList, "products");
    const product = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Create the new product
        const productField = yield tx.products.create({
            data: {
                storeId: Number(storeId),
            }, include: {
                offers_products: {
                    select: { offers: true }
                }
            }
        });
        // Create the product details
        const details = yield tx.details.create({
            data: {
                productId: productField.id,
                name: name,
                description: description,
                price: Number(price),
                code,
                tags,
            },
        });
        // Create the product stock
        const stocks = yield tx.stocks.create({
            data: {
                productId: productField.id,
                quantity: Number(quantity),
            },
        });
        // Create the product image
        yield tx.images.createMany({
            data: imageUrls.map((image) => {
                return {
                    productId: productField.id,
                    path: image,
                };
            }),
            skipDuplicates: true,
        });
        yield tx.categories_Products.createMany({
            data: categoryIds.map((item) => {
                return {
                    productId: productField.id,
                    categoryId: item,
                };
            }),
            skipDuplicates: true,
        });
        const uom = yield tx.uOM.create({
            data: {
                piece: typeof piece === null ? null : Number(piece),
                bora: typeof bora === null ? null : Number(bora),
                carton: typeof carton === null ? null : Number(carton),
                kg: typeof kg === null ? null : Number(kg),
                productId: productField.id
            }
        });
        const categories = yield tx.categories_Products.findMany({
            where: { productId: productField.id },
            select: { category: true },
        });
        return {
            id: productField.id,
            storeId: productField.storeId,
            details,
            images: imageUrls,
            stocks,
            category: categories.map((item) => item.category),
            uom,
            offers: productField.offers_products.map(item => item.offers)
        };
    }));
    return (0, product_mapper_1.productMapper)(product);
});
exports.createProduct = createProduct;
//delete Product
const deleteProduct = (productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prisma.products.findUnique({
        where: {
            id: productId,
            stores: {
                userId
            }
        },
    });
    if (!product)
        throw new http_exception_model_1.default(404, "Product not found");
    const images = yield prisma.images.findMany({
        where: { productId },
        select: { path: true },
    });
    const imageFilename = images.map((image) => image.path.split("appspot.com/").pop());
    const deletedProduct = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const details = yield tx.details.delete({
            where: {
                productId: productId,
            },
        });
        const uom = yield tx.uOM.delete({
            where: {
                productId
            }
        });
        // Delete the related product stock
        yield tx.stocks.deleteMany({
            where: {
                productId: productId,
            },
        });
        // Delete the related product images
        yield tx.images.deleteMany({
            where: {
                productId: productId,
            },
        });
        // Delete the product-category relationship
        yield tx.categories_Products.deleteMany({
            where: {
                productId: productId,
            },
        });
        yield tx.carts_Products.deleteMany({
            where: { productId }
        });
        yield tx.offers_Products.deleteMany({
            where: { productId }
        });
        const productData = yield tx.products.delete({
            where: {
                id: productId,
            },
            select: {
                storeId: true,
                offers_products: {
                    select: {
                        offers: true
                    }
                }
            },
        });
        return {
            storeId: productData.storeId,
            details: details,
            uom,
        };
    }));
    yield imageFilename.map((imagePath) => {
        return firebase_1.bucket.file(imagePath).delete();
    });
    return (0, product_mapper_1.productDeleteMapper)(deletedProduct);
});
exports.deleteProduct = deleteProduct;
//get Product by Id
const getProductById = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const productData = yield prisma.products.findUnique({
        where: {
            id: productId,
        },
        select: {
            categories_products: {
                select: { category: true },
            },
            id: true,
            storeId: true,
            details: true,
            stocks: true,
            images: true,
            uom: true,
            offers_products: { select: { offers: true } }
        },
    });
    if (!productData)
        throw new http_exception_model_1.default(404, "Product not found");
    const categoriesDetails = productData === null || productData === void 0 ? void 0 : productData.categories_products.map((item) => item.category);
    const totalQuantity = productData.stocks.reduce((sum, item) => sum + item.quantity, 0);
    productData.stocks[productData.stocks.length - 1].quantity = totalQuantity;
    const productQuery = {
        id: productData.id,
        storeId: productData.storeId,
        details: productData.details,
        images: productData.images.map((item) => item.path),
        stocks: productData.stocks[productData.stocks.length - 1],
        category: categoriesDetails,
        uom: productData.uom,
        offers: productData.offers_products.map(item => item.offers)
    };
    return (0, product_mapper_1.productMapper)(productQuery);
});
exports.getProductById = getProductById;
//update Product by ID
const updateProductById = (productId, productData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const checkProduct = yield prisma.products.findUnique({
        where: {
            id: productId,
            stores: {
                userId
            }
        },
    });
    if (!checkProduct)
        throw new http_exception_model_1.default(404, "Product to be updated not found");
    const { storeId, name, description, quantity, categoryId, price, code, tags, piece, bora, carton, kg } = productData;
    if (!storeId)
        throw new http_exception_model_1.default(400, "Store id can't be blank");
    const storeData = yield prisma.stores.findUnique({
        where: {
            id: Number(storeId),
            userId
        },
    });
    if (!storeData)
        throw new http_exception_model_1.default(404, "Store not found");
    if (!name)
        throw new http_exception_model_1.default(400, "Product name can't be blank");
    if (!description)
        throw new http_exception_model_1.default(400, "Description can't be blank");
    if (!price)
        throw new http_exception_model_1.default(400, "Price can't be blank");
    if (!quantity)
        throw new http_exception_model_1.default(400, "Product quantity can't be blank");
    if (!code)
        throw new http_exception_model_1.default(400, "Code can't be blank");
    const checkCode = yield prisma.details.findFirst({
        where: {
            code,
            productId: {
                not: productId,
            },
        },
    });
    if (checkCode)
        throw new http_exception_model_1.default(409, "The code already exist");
    if (categoryId.length === 0)
        throw new http_exception_model_1.default(400, "Category id can't be blank");
    let categoryIds = categoryId.map((item) => Number(item));
    const category = yield prisma.categories.findMany({
        where: {
            id: {
                in: categoryIds,
            },
        },
    });
    if (!category)
        throw "Category not found";
    const product = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // update product
        const productField = yield tx.products.update({
            where: {
                id: productId,
            },
            data: {
                storeId: Number(storeId),
                updatedAt: new Date()
            },
            include: {
                offers_products: {
                    select: {
                        offers: true
                    }
                }
            }
        });
        // update product details
        const details = yield tx.details.update({
            where: {
                productId,
            },
            data: {
                name: name,
                description: description,
                price: Number(price),
                code,
                updatedAt: new Date()
            },
        });
        // update product stock
        const stocks = yield tx.stocks.create({
            data: {
                productId: productField.id,
                quantity: Number(quantity),
                updatedAt: new Date()
            },
        });
        const uom = yield tx.uOM.update({
            where: {
                productId
            }, data: {
                piece: typeof piece === null ? null : Number(piece),
                bora: typeof bora === null ? null : Number(bora),
                carton: typeof carton === null ? null : Number(carton),
                kg: typeof kg === null ? null : Number(kg),
                updatedAt: new Date()
            }
        });
        // update the categories_product relation
        yield (0, update_utils_1.updateCategoriesProducts)(categoryIds, productId);
        const categories = yield tx.categories_Products.findMany({
            where: { productId: productField.id },
            select: { category: true },
        });
        const images = yield tx.images.findMany({
            where: { productId: productField.id },
            select: { path: true },
        });
        return {
            id: productField.id,
            storeId: productField.storeId,
            details,
            images: images.map((image) => image.path),
            stocks,
            category: categories.map((item) => item.category),
            uom,
            offers: productField.offers_products.map(item => item.offers)
        };
    }));
    return (0, product_mapper_1.productMapper)(product);
});
exports.updateProductById = updateProductById;
//get All Products
const getAllProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const productList = yield prisma.products.findMany({
        include: {
            details: {
                select: {
                    name: true,
                    description: true,
                    price: true,
                    code: true,
                    tags: true,
                },
            },
            stocks: {
                select: {
                    quantity: true,
                },
            },
            images: {
                select: { path: true },
            },
            uom: {
                select: { piece: true, bora: true, carton: true, kg: true }
            },
            offers_products: {
                select: {
                    offers: true
                }
            },
            categories_products: {
                select: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
    });
    //to calculate total quantities from list of stocks for each product
    const productTotalQuantity = productList.map((product) => product.stocks.reduce((sum, item) => sum + item.quantity, 0));
    //to map total quantity of each product
    productList.forEach((product, index) => {
        product.quantity = productTotalQuantity[index];
    });
    //to exclude stocks object from array
    return productList.map((product) => {
        const { stocks } = product, rest = __rest(product, ["stocks"]);
        return rest;
    });
});
exports.getAllProducts = getAllProducts;
