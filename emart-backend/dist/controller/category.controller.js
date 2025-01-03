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
const express_1 = require("express");
const router = (0, express_1.Router)();
const rbac_1 = require("../middleware/rbac");
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const category_service_1 = require("../services/category.service");
const validateToken_1 = require("../middleware/validateToken");
router.post('/', validateToken_1.validateToken, (0, rbac_1.allow)(['Wholesaler']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryData = req.body;
        if (!categoryData || typeof categoryData === undefined)
            throw new http_exception_model_1.default(400, "Category data is not defined");
        let userId = req.userId;
        if (typeof userId === null || typeof userId === undefined)
            throw new http_exception_model_1.default(400, "User id not provided");
        const createdCategory = yield (0, category_service_1.createCategory)(categoryData, userId);
        res.status(201).json({
            msg: "Category created",
            result: createdCategory
        });
    }
    catch (error) {
        next(error);
    }
}));
router.delete('/:categoryId', validateToken_1.validateToken, (0, rbac_1.allow)(['Wholesaler']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let categoryId = Number(req.params.categoryId);
        if (typeof categoryId === undefined)
            throw new http_exception_model_1.default(400, "Category id is not defined");
        let userId = req.userId;
        if (typeof userId === null || typeof userId === undefined)
            throw new http_exception_model_1.default(400, "User id not provided");
        const deletedCategory = yield (0, category_service_1.deleteCategoryById)(categoryId, userId);
        res.status(201).json({
            msg: "Category deleted",
            result: deletedCategory
        });
    }
    catch (error) {
        next(error);
    }
}));
router.get('/all-categories', validateToken_1.validateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoriesData = yield (0, category_service_1.getAllCategory)();
        if (!categoriesData)
            throw new http_exception_model_1.default(400, "Empty categories");
        res.status(200).json({
            msg: "Categories fetched",
            result: categoriesData
        });
    }
    catch (error) {
        next(error);
    }
}));
router.get('/', validateToken_1.validateToken, (0, rbac_1.allow)(['Wholesaler']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = req.userId;
        if (!userId || typeof userId === undefined)
            throw new http_exception_model_1.default(400, "User id not defined");
        const categoryList = yield (0, category_service_1.getCategoryByUserId)(userId);
        if (!categoryList)
            throw new http_exception_model_1.default(404, "no categories found");
        res.status(200).json({
            msg: "Categories fetched",
            result: categoryList
        });
    }
    catch (error) {
        next(error);
    }
}));
router.patch('/:categoryId', validateToken_1.validateToken, (0, rbac_1.allow)(['Wholesaler']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let categoryId = Number(req.params.categoryId);
        if (typeof categoryId === undefined)
            throw new http_exception_model_1.default(400, "Category id is not defined");
        const categoryData = req.body;
        if (!categoryData || typeof categoryData === undefined)
            throw new http_exception_model_1.default(400, "Category data is not defined");
        let userId = req.userId;
        if (typeof userId === null || typeof userId === undefined)
            throw new http_exception_model_1.default(400, "User id not provided");
        const updatedCategory = yield (0, category_service_1.updateCategory)(categoryData, categoryId, userId);
        res.status(201).json({
            msg: "Category updated",
            result: updatedCategory
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
