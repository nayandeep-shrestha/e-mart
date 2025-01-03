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
exports.deleteImage = exports.uploadImage = exports.getImageUrl = void 0;
const client_1 = require("@prisma/client");
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const prisma = new client_1.PrismaClient();
const firebase_1 = require("../firebase");
const firebaseUpload_1 = require("../utils/firebaseUpload");
const getImageUrl = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    if (!fileName)
        throw new http_exception_model_1.default(400, "Filename empty");
    const blob = firebase_1.bucket.file(`uploads/${fileName}`);
    const imageData = yield prisma.images.findFirst({
        where: {
            path: `https://storage.googleapis.com/${firebase_1.bucket.name}/${blob.name}`
        }
    });
    if (!imageData)
        throw new http_exception_model_1.default(404, "No image of that name");
    const file = firebase_1.bucket.file(`uploads/${fileName}`);
    const url = yield file.getSignedUrl({
        action: 'read',
        expires: '03-17-2025',
    });
    if (!url)
        throw new http_exception_model_1.default(404, "Image not found");
    return url;
});
exports.getImageUrl = getImageUrl;
const uploadImage = (images, productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const checkProduct = yield prisma.products.findUnique({
        where: {
            id: productId,
            stores: {
                userId
            }
        }
    });
    if (!checkProduct)
        throw new http_exception_model_1.default(404, "Product not found");
    const imagePaths = yield (0, firebaseUpload_1.imageUploadToFirebase)(images, 'products');
    for (const imagePath of imagePaths) {
        yield prisma.images.create({
            data: {
                productId,
                path: imagePath
            }
        });
    }
    return imagePaths;
});
exports.uploadImage = uploadImage;
const deleteImage = (imageFilename) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield firebase_1.bucket.file(`uploads/products/${imageFilename}`).delete();
        const imagePath = process.env.IMAGE_URL + 'products/' + imageFilename;
        yield prisma.images.deleteMany({
            where: {
                path: imagePath,
            }
        });
    }
    catch (error) {
        throw new http_exception_model_1.default(404, error);
    }
});
exports.deleteImage = deleteImage;
