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
exports.updateCategory = exports.getCategoryByUserId = exports.getAllCategory = exports.deleteCategoryById = exports.createCategory = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const category_mapper_1 = require("../mappers/category.mapper");
const createCategory = (categoryData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, status, storeId } = categoryData;
    if (!name)
        throw new http_exception_model_1.default(400, "Category name can't be blank");
    if (!status)
        throw new http_exception_model_1.default(400, "Category status can't be blank");
    if (!storeId)
        throw new http_exception_model_1.default(400, "Category storeId can't be blank");
    const checkStoreUser = yield prisma.stores.findUnique({
        where: {
            id: storeId,
            userId
        }
    });
    if (!checkStoreUser)
        throw new http_exception_model_1.default(404, "Store not found");
    const createdCategory = yield prisma.categories.create({
        data: {
            name,
            status,
            storeId,
        },
    });
    if (!createdCategory)
        throw new http_exception_model_1.default(400, "Category creation failed");
    return (0, category_mapper_1.categoryMapper)(createdCategory);
});
exports.createCategory = createCategory;
const deleteCategoryById = (categoryId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryCheck = yield prisma.categories.findUnique({
        where: {
            id: categoryId,
            stores: {
                userId
            }
        },
    });
    if (!categoryCheck)
        throw new http_exception_model_1.default(404, "Category to be deleted not found");
    const deletedCategory = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.categoryBanner.deleteMany({
            where: {
                categoryId,
            },
        });
        yield tx.categories_Products.deleteMany({
            where: { categoryId },
        });
        return yield tx.categories.delete({
            where: { id: categoryId },
        });
    }));
    return (0, category_mapper_1.categoryMapper)(deletedCategory);
});
exports.deleteCategoryById = deleteCategoryById;
const getAllCategory = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield prisma.categories.findMany();
    if (!categories)
        throw new http_exception_model_1.default(404, "Categories not found");
    return (0, category_mapper_1.categoryListMapper)(categories);
});
exports.getAllCategory = getAllCategory;
const getCategoryByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const storesList = yield prisma.stores.findMany({
        where: {
            userId,
        },
    });
    if (!storesList)
        throw new http_exception_model_1.default(404, "User has not stores");
    const storeIdList = storesList.map((store) => store.id);
    const categoryList = yield prisma.categories.findMany({
        where: {
            storeId: {
                in: storeIdList,
            },
        },
    });
    return (0, category_mapper_1.categoryListMapper)(categoryList);
});
exports.getCategoryByUserId = getCategoryByUserId;
const updateCategory = (categoryData, categoryId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryCheck = yield prisma.categories.findFirst({
        where: {
            id: categoryId,
            stores: {
                userId
            }
        },
    });
    if (!categoryCheck)
        throw new http_exception_model_1.default(404, "Category to be updated not found");
    const { name, status, storeId } = categoryData;
    if (!name)
        throw new http_exception_model_1.default(400, "Category name can't be blank");
    if (!status)
        throw new http_exception_model_1.default(400, "Category status can't be blank");
    if (!storeId)
        throw new http_exception_model_1.default(400, "Category storeId can't be blank");
    const checkStore = yield prisma.stores.findUnique({
        where: {
            id: storeId,
            userId
        }
    });
    if (!checkStore)
        throw new http_exception_model_1.default(404, "Invalid store");
    const updatedCategory = yield prisma.categories.update({
        where: {
            id: categoryId,
        },
        data: {
            name,
            status,
            storeId,
        },
    });
    if (!updatedCategory)
        throw new http_exception_model_1.default(400, "Category creation failed");
    return (0, category_mapper_1.categoryMapper)(updatedCategory);
});
exports.updateCategory = updateCategory;
