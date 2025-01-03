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
const product_service_1 = require("../services/product.service");
const validateToken_1 = require("../middleware/validateToken");
const rbac_1 = require("../middleware/rbac");
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const router = (0, express_1.Router)();
const uploader = require("../middleware/upload");
const upload_path = (req, res, next) => {
    req.upload_path = "public/uploads/product";
    next();
};
router.post("/", validateToken_1.validateToken, (0, rbac_1.allow)(['Wholesaler']), uploader.array("images"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const images = req.files;
        if (Array.isArray(images)) {
            const product = yield (0, product_service_1.createProduct)(req.body, images, req.userId);
            res.status(201).json({ msg: "Successful", result: product });
        }
    }
    catch (error) {
        next(error);
    }
}));
router.delete("/:id", validateToken_1.validateToken, (0, rbac_1.allow)(['Wholesaler']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let productId = Number(req.params.id);
        if (typeof productId === null || typeof productId === undefined)
            throw new http_exception_model_1.default(400, "Product id not provided");
        let userId = req.userId;
        if (typeof userId === null || typeof userId === undefined)
            throw new http_exception_model_1.default(400, "User id not provided");
        const deletedData = yield (0, product_service_1.deleteProduct)(productId, userId);
        res.status(201).json({ msg: "Product deleted successfully", result: deletedData });
    }
    catch (error) {
        next(error);
    }
}));
router.get("/:id", validateToken_1.validateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let productId = Number(req.params.id);
        if (typeof productId === null || typeof productId === undefined)
            throw new http_exception_model_1.default(400, "Product id not provided");
        const productData = yield (0, product_service_1.getProductById)(productId);
        res.status(200).json({
            msg: "Product fetched",
            result: productData
        });
    }
    catch (error) {
        next(error);
    }
}));
router.get("/", validateToken_1.validateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productList = yield (0, product_service_1.getAllProducts)();
        res.status(200).json({
            msg: "Products fetched",
            result: productList
        });
    }
    catch (error) {
        next(error);
    }
}));
router.put("/:productId", validateToken_1.validateToken, (0, rbac_1.allow)(['Wholesaler']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let productId = Number(req.params.productId);
        if (typeof productId === null || typeof productId === undefined)
            throw new http_exception_model_1.default(400, "Product id not provided");
        let userId = req.userId;
        if (typeof userId === null || typeof userId === undefined)
            throw new http_exception_model_1.default(400, "User id not provided");
        const updatedProduct = yield (0, product_service_1.updateProductById)(productId, req.body, userId);
        if (!updatedProduct)
            throw new http_exception_model_1.default(400, "Product update failed");
        res.status(201).json({
            msg: "Product updated",
            result: updatedProduct
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
