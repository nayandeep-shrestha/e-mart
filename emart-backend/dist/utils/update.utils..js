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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategoriesProducts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const updateCategoriesProducts = (categoryIds, productId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingCategories = yield prisma.categories_Products.findMany({
        where: {
            productId: productId
        },
        select: {
            categoryId: true
        }
    });
    const existingCategoryIds = existingCategories.map(cp => cp.categoryId);
    // Determine changes
    const categoriesToAdd = categoryIds.filter(id => !existingCategoryIds.includes(id));
    const categoriesToRemove = existingCategoryIds.filter(id => !categoryIds.includes(id));
    //update the categories_product relation
    for (const categoryId of categoriesToAdd) {
        yield prisma.categories_Products.create({
            data: {
                productId: productId,
                categoryId: categoryId
            }
        });
    }
    // Remove old associations
    for (const categoryId of categoriesToRemove) {
        yield prisma.categories_Products.deleteMany({
            where: {
                productId: productId,
                categoryId: categoryId
            }
        });
    }
    return true;
});
exports.updateCategoriesProducts = updateCategoriesProducts;
