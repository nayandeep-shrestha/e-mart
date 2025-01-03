"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryListMapper = exports.categoryMapper = void 0;
const categoryMapper = (category) => ({
    id: category.id,
    name: category.name,
    status: category.status,
    storeId: category.storeId
});
exports.categoryMapper = categoryMapper;
const categoryListMapper = (category) => (category.map(item => ({
    id: item.id,
    name: item.name,
    status: item.status,
    storeId: item.storeId
})));
exports.categoryListMapper = categoryListMapper;
