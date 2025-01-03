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
exports.getOffers = exports.handleOfferProduct = exports.deleteOffer = exports.createOffer = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const firebaseUpload_1 = require("../utils/firebaseUpload");
const offer_mapper_1 = require("../mappers/offer.mapper");
const createOffer = (offerData, imageList, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = offerData;
    if (!name)
        throw new http_exception_model_1.default(400, "Offer name can't be blank");
    const imageUrls = yield (0, firebaseUpload_1.imageUploadToFirebase)(imageList, "offers");
    const offerCreated = yield prisma.offers.create({
        data: {
            name,
            image: imageUrls[0],
            usersId: userId,
        }
    });
    return (0, offer_mapper_1.offerMapper)(offerCreated);
});
exports.createOffer = createOffer;
const deleteOffer = (offerId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!offerId)
        throw new http_exception_model_1.default(400, "Offer id not provided");
    const checkOffer = yield prisma.offers.findUnique({
        where: {
            id: offerId,
            usersId: userId
        }
    });
    if (!checkOffer)
        throw new http_exception_model_1.default(404, "Offer id not found");
    const deletedOffer = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.offers_Products.deleteMany({
            where: {
                offerId
            }
        });
        return yield tx.offers.delete({
            where: {
                id: offerId
            }
        });
    }));
    return (0, offer_mapper_1.offerMapper)(deletedOffer);
});
exports.deleteOffer = deleteOffer;
const handleOfferProduct = (offerIds, productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!offerIds)
        throw new http_exception_model_1.default(400, "Offer ids are not defined");
    if (offerIds.length > 0) {
        const checkProduct = yield prisma.products.findUnique({
            where: {
                id: productId,
                stores: {
                    userId
                }
            },
        });
        if (!checkProduct)
            throw new http_exception_model_1.default(404, "Product to be updated not found");
        const existingOffers = yield prisma.offers_Products.findMany({
            where: {
                productId: productId
            },
            select: {
                offerId: true
            }
        });
        const existingOfferIds = existingOffers.map(op => op.offerId);
        // Determine changes
        const offersToAdd = offerIds.filter(id => !existingOfferIds.includes(id));
        const offersToRemove = existingOfferIds.filter(id => !offerIds.includes(id));
        //update the offers_product relation
        for (const offerId of offersToAdd) {
            yield prisma.offers_Products.create({
                data: {
                    productId: productId,
                    offerId: offerId
                }
            });
        }
        // Remove old associations
        for (const offerId of offersToRemove) {
            yield prisma.offers_Products.deleteMany({
                where: {
                    productId: productId,
                    offerId: offerId
                }
            });
        }
        const addedOffers = yield prisma.offers_Products.findMany({
            where: {
                productId
            }, select: {
                offers: {
                    select: {
                        name: true,
                        image: true
                    }
                }
            }
        });
        return addedOffers;
    }
    yield prisma.offers_Products.deleteMany({
        where: {
            productId
        }
    });
    return true;
});
exports.handleOfferProduct = handleOfferProduct;
const getOffers = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const offersList = yield prisma.offers.findMany({
        where: { usersId: userId }
    });
    if (offersList.length <= 0)
        throw new http_exception_model_1.default(404, "No offers found");
    return (0, offer_mapper_1.offerListMapper)(offersList);
});
exports.getOffers = getOffers;
