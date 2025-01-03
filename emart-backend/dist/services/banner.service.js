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
exports.getAllBanner = exports.deleteBanner = exports.createBanner = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const firebaseUpload_1 = require("../utils/firebaseUpload");
const firebase_1 = require("../firebase");
const banner_mapper_1 = require("../mappers/banner.mapper");
// create Product + Category Banner
const createBanner = (name, userId, image, productId, categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!name) {
        throw new http_exception_model_1.default(400, "Name is required");
    }
    const checkUser = yield prisma.users.findUnique({
        where: { id: userId },
    });
    if (!checkUser)
        throw new http_exception_model_1.default(404, "User not found");
    const imageLinks = yield (0, firebaseUpload_1.imageUploadToFirebase)(image, "banners");
    const createData = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const bannerData = yield tx.banners.create({
            data: {
                name,
                imageLink: imageLinks[0],
                userId,
            },
        });
        if (!bannerData)
            throw new http_exception_model_1.default(404, "Banner can't be created");
        yield tx.productBanner.createMany({
            data: productId.map((item) => {
                return {
                    bannerId: bannerData.id,
                    productId: item,
                };
            }),
        });
        yield tx.categoryBanner.createMany({
            data: categoryId.map((item) => {
                return {
                    bannerId: bannerData.id,
                    categoryId: item,
                };
            }),
        });
        return bannerData;
    }));
    return (0, banner_mapper_1.bannerMapper)(createData);
});
exports.createBanner = createBanner;
//delete Product + Category Banner
const deleteBanner = (bannerId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!bannerId)
        throw new http_exception_model_1.default(400, "Banner id can't be blank");
    const checkBanner = yield prisma.banners.findUnique({
        where: {
            id: bannerId,
        },
    });
    if (!checkBanner)
        throw new http_exception_model_1.default(404, "Banner to be deleted not found");
    const deletedBanner = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const imageLink = checkBanner.imageLink.split("appspot.com/").pop();
        yield tx.productBanner.deleteMany({
            where: {
                bannerId: checkBanner.id,
            },
        });
        yield tx.categoryBanner.deleteMany({
            where: {
                bannerId: checkBanner.id,
            },
        });
        const deleteBanner = yield tx.banners.delete({
            where: {
                id: bannerId,
            },
        });
        if (!deleteBanner)
            throw new http_exception_model_1.default(404, "Data deletion failed");
        if (typeof imageLink === "string") {
            yield firebase_1.bucket.file(imageLink).delete();
        }
        return deleteBanner;
    }));
    return (0, banner_mapper_1.bannerMapper)(deletedBanner);
});
exports.deleteBanner = deleteBanner;
// get All Banner Data
const getAllBanner = () => __awaiter(void 0, void 0, void 0, function* () {
    const banners = yield prisma.banners.findMany({
        include: {
            product_banner: {
                select: {
                    product: {
                        select: {
                            id: true,
                        },
                    },
                },
            },
            category_banner: {
                select: {
                    category: {
                        select: {
                            id: true,
                        },
                    },
                },
            },
        },
    });
    if (!banners || banners.length === 0) {
        throw new http_exception_model_1.default(404, "No banners found");
    }
    return banners;
});
exports.getAllBanner = getAllBanner;
