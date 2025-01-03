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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAddress = exports.editAddress = exports.addAddress = exports.updateQuantity = exports.viewCart = exports.clearItemsFromCart = exports.clearCart = exports.addToCart = void 0;
const client_1 = require("@prisma/client");
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const cart_mapper_1 = require("../mappers/cart.mapper");
const order_address_mapper_1 = require("../mappers/order_address.mapper");
const prisma = new client_1.PrismaClient();
//add to cart
const addToCart = (userId, cartData) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof cartData === 'undefined')
        throw new http_exception_model_1.default(400, 'Data not defined');
    const { cart_items } = cartData;
    if (cart_items.length === 0)
        throw new http_exception_model_1.default(400, "Empty cart data");
    const productIds = cart_items.map((item) => item.productId);
    // Check if all productIds exist in the Products table
    const products = yield prisma.products.findMany({
        where: {
            id: { in: productIds },
        },
        select: {
            id: true,
        },
    });
    const foundProductIds = products.map((product) => product.id);
    const missingProductIds = productIds.filter(id => !foundProductIds.includes(id));
    if (missingProductIds.length > 0) {
        throw new http_exception_model_1.default(400, `The following products do not exist: ${missingProductIds.join(', ')}`);
    }
    //Sum of quantities for each product
    const stockLevels = yield prisma.stocks.groupBy({
        by: ["productId"],
        where: {
            productId: { in: productIds },
        },
        _sum: {
            quantity: true,
        },
    });
    // Create a map of productId to total stock quantity
    const stockMap = stockLevels.reduce((acc, stock) => {
        acc[stock.productId] = stock._sum.quantity || 0;
        return acc;
    }, {});
    // Check if requested quantities are available
    for (const item of cart_items) {
        const availableStock = stockMap[item.productId] || 0;
        if (item.quantity > availableStock) {
            throw new http_exception_model_1.default(400, `Insufficient stock for product ${item.productId}`);
        }
    }
    const checkCart = yield prisma.carts.findUnique({
        where: { userId }
    });
    //if old cart exist add data to that card
    if (checkCart) {
        // If the cart exists, check each product and update quantity if it exists or add it if it doesn't
        for (const item of cart_items) {
            const existingCartProduct = yield prisma.carts_Products.findUnique({
                where: {
                    productId_cartId: {
                        productId: item.productId,
                        cartId: checkCart.id
                    }
                }
            });
            if (existingCartProduct) {
                // Update the quantity of the existing product
                yield prisma.carts_Products.update({
                    where: {
                        productId_cartId: {
                            productId: item.productId,
                            cartId: checkCart.id
                        }
                    },
                    data: {
                        quantity: existingCartProduct.quantity + item.quantity,
                        subTotal: existingCartProduct.subTotal + item.subTotal,
                        updatedAt: new Date() // Update the timestamp
                    }
                });
            }
            else {
                // Add the new product to the cart
                yield prisma.carts_Products.create({
                    data: {
                        productId: item.productId,
                        quantity: item.quantity,
                        cartId: checkCart.id,
                        subTotal: item.subTotal
                    }
                });
            }
        }
        const updatedCartItems = yield prisma.carts_Products.findMany({
            where: {
                cartId: checkCart.id
            }
        });
        return (0, cart_mapper_1.cartMapper)({
            id: checkCart.id,
            userId: checkCart.userId,
            cart_items: updatedCartItems
        });
    }
    const addToCart = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const cart = yield prisma.carts.create({
            data: {
                userId
            }
        });
        yield prisma.carts_Products.createMany({
            data: cart_items.map((item) => {
                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    subTotal: item.subTotal,
                    cartId: cart.id
                };
            }),
            skipDuplicates: true
        });
        return {
            id: cart.id,
            userId: cart.userId,
            cart_items: cart_items
        };
    }));
    return (0, cart_mapper_1.cartMapper)(addToCart);
});
exports.addToCart = addToCart;
//clear cart
const clearCart = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const checkCart = yield prisma.carts.findUnique({
        where: { userId }
    });
    if (!checkCart)
        throw new http_exception_model_1.default(404, "No cart found");
    const cartToClear = yield prisma.carts_Products.findMany({
        where: { cartId: checkCart.id }
    });
    if (!cartToClear || cartToClear.length === 0)
        throw new http_exception_model_1.default(404, "No cart items found");
    yield prisma.carts_Products.deleteMany({
        where: {
            cartId: checkCart.id
        }
    });
    return (0, cart_mapper_1.cartMapper)({ id: checkCart.id, cart_items: cartToClear });
});
exports.clearCart = clearCart;
//clear specific items from cart
const clearItemsFromCart = (userId, productIds) => __awaiter(void 0, void 0, void 0, function* () {
    const checkCart = yield prisma.carts.findUnique({
        where: { userId }
    });
    if (!checkCart)
        throw new http_exception_model_1.default(404, "No cart found");
    const itemsToClear = yield prisma.carts_Products.findMany({
        where: {
            cartId: checkCart.id,
            productId: {
                in: productIds
            }
        }
    });
    if (!itemsToClear || itemsToClear.length === 0)
        throw new http_exception_model_1.default(404, "Items to clear not found");
    yield prisma.carts_Products.deleteMany({
        where: {
            cartId: checkCart.id,
            productId: {
                in: productIds
            }
        }
    });
    return (0, cart_mapper_1.cartMapper)({ id: checkCart.id, cart_items: itemsToClear });
});
exports.clearItemsFromCart = clearItemsFromCart;
//view cart
const viewCart = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const checkCart = yield prisma.carts.findUnique({
        where: { userId },
        include: {
            carts_items: true,
            order_address: true
        }
    });
    if (!checkCart)
        throw new http_exception_model_1.default(404, "Cart not found");
    if (checkCart.carts_items.length === 0)
        throw new http_exception_model_1.default(404, "Cart is empty");
    return (0, cart_mapper_1.cartMapper)({ id: checkCart.id, cart_items: checkCart.carts_items, orderAddress: checkCart.order_address });
});
exports.viewCart = viewCart;
//update quantity
const updateQuantity = (userId, dataToUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof dataToUpdate === undefined)
        throw new http_exception_model_1.default(400, "Data is not defined");
    const { cart_items } = dataToUpdate;
    if (!Array.isArray(cart_items) || cart_items.length === 0)
        throw new http_exception_model_1.default(400, "Data to update is invalid");
    const checkCart = yield prisma.carts.findUnique({
        where: { userId },
        include: { carts_items: true }
    });
    if (!checkCart)
        throw new http_exception_model_1.default(404, "No cart found");
    // check if all provided products to update exist in cart or not
    const existingProductIds = checkCart.carts_items.map(item => item.productId);
    const missingProductIds = cart_items
        .filter(item => !existingProductIds.includes(item.productId))
        .map(item => item.productId);
    if (missingProductIds.length > 0)
        throw new http_exception_model_1.default(400, `Update failed. Some products do not exist in the cart: ${missingProductIds} `);
    cart_items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.carts_Products.updateMany({
            where: {
                cartId: checkCart.id,
                productId: item.productId
            },
            data: {
                quantity: item.quantity,
                subTotal: item.subTotal,
                updatedAt: new Date()
            }
        });
    }));
    const updatedCart = yield prisma.carts.findUnique({
        where: { id: checkCart.id },
        include: { carts_items: true }
    });
    if (!updatedCart)
        throw new http_exception_model_1.default(400, "updated cart not found");
    return (0, cart_mapper_1.cartMapper)({
        id: updatedCart.id,
        cart_items: updatedCart.carts_items
    });
});
exports.updateQuantity = updateQuantity;
//add shipping or biling address
const addAddress = (userId, addressDetail) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof addressDetail === undefined)
        throw new http_exception_model_1.default(400, "Address detail not defined");
    const { fullName, country, city, streetName, type } = addressDetail;
    if (!fullName || typeof fullName !== 'string') {
        throw new http_exception_model_1.default(400, 'Invalid fullName');
    }
    if (!country || typeof country !== 'string') {
        throw new http_exception_model_1.default(400, 'Invalid country');
    }
    if (!city || typeof city !== 'string') {
        throw new http_exception_model_1.default(400, 'Invalid city');
    }
    if (!streetName || typeof streetName !== 'string') {
        throw new http_exception_model_1.default(400, 'Invalid streetName');
    }
    if (type !== 'Shipping' && type !== 'Billing') {
        throw new http_exception_model_1.default(400, 'Invalid address type');
    }
    const checkCart = yield prisma.carts.findUnique({
        where: { userId }
    });
    if (!checkCart)
        throw new http_exception_model_1.default(400, "Invalid entry");
    const addedAddress = yield prisma.order_Address.create({
        data: {
            cartId: checkCart.id,
            fullName,
            country,
            city,
            streetName,
            type
        }
    });
    if (!addedAddress)
        throw new http_exception_model_1.default(400, 'Address addition failed');
    return (0, order_address_mapper_1.orderAddressMapper)(addedAddress);
});
exports.addAddress = addAddress;
//edit address
const editAddress = (addressId, addressDetail) => __awaiter(void 0, void 0, void 0, function* () {
    const checkAddress = yield prisma.order_Address.findUnique({
        where: { id: addressId }
    });
    if (!checkAddress)
        throw new http_exception_model_1.default(404, "Address to be updated not found");
    if (typeof addressDetail === undefined)
        throw new http_exception_model_1.default(400, "Address detail not defined");
    const { fullName, country, city, streetName, type } = addressDetail;
    if (!fullName || typeof fullName !== 'string') {
        throw new http_exception_model_1.default(400, 'Invalid fullName');
    }
    if (!country || typeof country !== 'string') {
        throw new http_exception_model_1.default(400, 'Invalid country');
    }
    if (!city || typeof city !== 'string') {
        throw new http_exception_model_1.default(400, 'Invalid city');
    }
    if (!streetName || typeof streetName !== 'string') {
        throw new http_exception_model_1.default(400, 'Invalid streetName');
    }
    if (type !== 'Shipping' && type !== 'Billing') {
        throw new http_exception_model_1.default(400, 'Invalid address type');
    }
    const addedAddress = yield prisma.order_Address.update({
        where: {
            id: addressId
        },
        data: {
            fullName,
            country,
            city,
            streetName,
            type
        }
    });
    return (0, order_address_mapper_1.orderAddressMapper)(addedAddress);
});
exports.editAddress = editAddress;
//delete address
const deleteAddress = (addressId) => __awaiter(void 0, void 0, void 0, function* () {
    const checkAddress = yield prisma.order_Address.findUnique({
        where: {
            id: addressId
        }
    });
    if (!checkAddress)
        throw new http_exception_model_1.default(404, "Address to be deleted not found");
    const deletedAddress = yield prisma.order_Address.delete({
        where: { id: addressId }
    });
    if (!deletedAddress)
        throw new http_exception_model_1.default(400, "Address deletion failed");
    return (0, order_address_mapper_1.orderAddressMapper)(deletedAddress);
});
exports.deleteAddress = deleteAddress;
