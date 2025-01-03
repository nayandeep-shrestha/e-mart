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
const validateToken_1 = require("../middleware/validateToken");
const rbac_1 = require("../middleware/rbac");
const offer_service_1 = require("../services/offer.service");
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const uploader = require("../middleware/upload");
const router = (0, express_1.Router)();
router.post("/", validateToken_1.validateToken, (0, rbac_1.allow)(['Wholesaler']), uploader.array('images', 1), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const images = req.files;
        if (Array.isArray(images)) {
            const offer = yield (0, offer_service_1.createOffer)(req.body, images, req.userId);
            res.status(201).json({ msg: "Offer Created", result: offer });
        }
    }
    catch (error) {
        next(error);
    }
}));
router.delete('/:offerId', validateToken_1.validateToken, (0, rbac_1.allow)(['Wholesaler']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId)
            throw new http_exception_model_1.default(400, "User id not defined");
        const deletedOffer = yield (0, offer_service_1.deleteOffer)(Number(req.params.offerId), userId);
        res.status(201).json({
            msg: "Order deleted",
            result: deletedOffer
        });
    }
    catch (error) {
        next(error);
    }
}));
router.get('/', validateToken_1.validateToken, (0, rbac_1.allow)(['Wholesaler']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId)
            throw new http_exception_model_1.default(400, "User id is not defined");
        const offersList = yield (0, offer_service_1.getOffers)(userId);
        res.status(200).json({
            msg: "Offers fetched",
            result: offersList
        });
    }
    catch (error) {
        next(error);
    }
}));
router.post('/:productId/offer-products/', validateToken_1.validateToken, (0, rbac_1.allow)(['Wholesaler']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId)
            throw new http_exception_model_1.default(400, "User id is not defined");
        const productId = Number(req.params.productId);
        if (!productId)
            throw new http_exception_model_1.default(400, "Product id is not defined");
        const { offerIds } = req.body;
        const result = yield (0, offer_service_1.handleOfferProduct)(offerIds, productId, userId);
        res.status(201).json({
            msg: result === true ? "Offers cleared" : "Offers in product updated",
            result: result
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
