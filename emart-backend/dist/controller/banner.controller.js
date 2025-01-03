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
const validateToken_1 = require("../middleware/validateToken");
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const rbac_1 = require("../middleware/rbac");
const banner_service_1 = require("../services/banner.service");
const uploader = require("../middleware/upload");
//create Banner
router.post("/", validateToken_1.validateToken, (0, rbac_1.allow)(["Wholesaler"]), uploader.array("images", 1), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const image = req.files;
        const userId = req.userId;
        const name = req.body.name;
        
        //for product ID
        const productIdsString = req.body.productIds;
        const productIds = productIdsString
            ? JSON.parse(productIdsString)
            : [];
        //for category ID
        const categoryIdsString = req.body.categoryIds;
        const categoryIds = categoryIdsString
            ? JSON.parse(categoryIdsString)
            : [];
        console;
        if (!userId)
            throw new http_exception_model_1.default(400, "User id is not defined");
        if (!name)
            throw new http_exception_model_1.default(400, "Name can't be blank");
        if ((!productIds || productIds.length === 0) &&
            (!categoryIds || categoryIds.length === 0)) {
            throw new http_exception_model_1.default(400, "ProductIds or CategoryIds must be included");
        }
        if (productIds &&
            productIds.length > 0 &&
            categoryIds &&
            categoryIds.length > 0) {
            throw new http_exception_model_1.default(400, "Cannot include both productIds and categoryIds");
        }
        if (Array.isArray(image)) {
            const banner = yield (0, banner_service_1.createBanner)(name, userId, image, productIds, categoryIds);
            res.status(201).json({
                msg: "Banner created",
                result: Object.assign(Object.assign({}, banner), { productId: productIds, categoryId: categoryIds }),
            });
        }
    }
    catch (error) {
        next(error);
        console.log(error);
    }
}));
//delete Banner
router.delete("/:bannerId", validateToken_1.validateToken, (0, rbac_1.allow)(["Wholesaler"]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedBanner = yield (0, banner_service_1.deleteBanner)(Number(req.params.bannerId));
        res.status(201).json({
            msg: "Banner Deleted",
            result: deletedBanner,
        });
    }
    catch (error) {
        next(error);
    }
}));
//get All Banners Data
router.get("/", validateToken_1.validateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const banner = yield (0, banner_service_1.getAllBanner)();
        res.status(200).json({
            msg: "Retrieved data",
            result: { banner },
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
