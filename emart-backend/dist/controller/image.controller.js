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
const image_service_1 = require("../services/image.service");
const rbac_1 = require("../middleware/rbac");
const validateToken_1 = require("../middleware/validateToken");
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const uploader = require("../middleware/upload");
router.get('/:name', validateToken_1.validateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = yield (0, image_service_1.getImageUrl)(req.params.name);
        res.status(200).json({
            msg: "Image url fetched",
            result: url
        });
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
router.post('/:productId', validateToken_1.validateToken, (0, rbac_1.allow)(['Wholesaler']), uploader.array("images"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const images = req.files;
        if (Array.isArray(images)) {
            const imagePaths = yield (0, image_service_1.uploadImage)(images, Number(req.params.productId), req.userId);
            res.status(201).json({
                msg: "image upload successful",
                result: imagePaths
            });
        }
    }
    catch (error) {
        next(error);
    }
}));
router.delete('/:imageFilename', validateToken_1.validateToken, (0, rbac_1.allow)(['Admin', "Wholesaler"]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let imageFilename = req.params.imageFilename;
        if (!imageFilename)
            throw new http_exception_model_1.default(400, "image name not deifned");
        yield (0, image_service_1.deleteImage)(imageFilename);
        res.status(201).json({
            msg: "image deleted"
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
