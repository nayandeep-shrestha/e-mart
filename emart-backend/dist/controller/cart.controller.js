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
const cart_service_1 = require("../services/cart.service");
const validateToken_1 = require("../middleware/validateToken");
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const rbac_1 = require("../middleware/rbac");
const router = (0, express_1.Router)();
//add to cart
router.post('/', validateToken_1.validateToken, (0, rbac_1.allow)(['Retailer']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId)
            throw new http_exception_model_1.default(400, "User id not defined");
        const addedData = yield (0, cart_service_1.addToCart)(userId, req.body);
        res.status(201).json({
            msg: "Data added to cart",
            result: addedData
        });
    }
    catch (error) {
        next(error);
    }
}));
//clear cart
router.post('/clear', validateToken_1.validateToken, (0, rbac_1.allow)(['Retailer']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId)
            throw new http_exception_model_1.default(400, "User id not defined");
        const clearedData = yield (0, cart_service_1.clearCart)(userId);
        res.status(201).json({
            msg: "Cart is cleared",
            result: clearedData
        });
    }
    catch (error) {
        next(error);
    }
}));
//clear specific items from cart
router.post('/clear/products', validateToken_1.validateToken, (0, rbac_1.allow)(['Retailer']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId)
            throw new http_exception_model_1.default(400, "User id not defined");
        let productIds;
        // Ensure req.query.productIds is a string and parse it as JSON
        if (typeof req.query.productIds === 'string') {
            try {
                productIds = JSON.parse(req.query.productIds);
            }
            catch (error) {
                throw new http_exception_model_1.default(400, "Invalid productIds format");
            }
        }
        else if (Array.isArray(req.query.productIds)) {
            // If it's an array, map the values to integers
            productIds = req.query.productIds.map(id => parseInt(id, 10));
        }
        else {
            throw new http_exception_model_1.default(400, "Invalid productIds format");
        }
        // Ensure productIds is an array of numbers
        if (!Array.isArray(productIds) || !productIds.every(id => typeof id === 'number')) {
            throw new http_exception_model_1.default(400, "Invalid productIds format");
        }
        const clearedData = yield (0, cart_service_1.clearItemsFromCart)(userId, productIds);
        res.status(201).json({
            msg: "Cart is cleared",
            result: clearedData
        });
    }
    catch (error) {
        next(error);
    }
}));
//view cart
router.get('/', validateToken_1.validateToken, (0, rbac_1.allow)(['Retailer']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId)
            throw new http_exception_model_1.default(400, "User id not defined");
        const cartDetails = yield (0, cart_service_1.viewCart)(userId);
        res.status(200).json({
            msg: "Cart details fetched",
            result: cartDetails
        });
    }
    catch (error) {
        next(error);
    }
}));
//update quantity
router.put('/', validateToken_1.validateToken, (0, rbac_1.allow)(['Retailer']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId)
            throw new http_exception_model_1.default(400, "User id not defined");
        const updatedCart = yield (0, cart_service_1.updateQuantity)(userId, req.body);
        res.status(201).json({
            msg: "Quantities updated",
            result: updatedCart
        });
    }
    catch (error) {
        next(error);
    }
}));
//add address
router.post('/address', validateToken_1.validateToken, (0, rbac_1.allow)(['Retailer']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId)
            throw new http_exception_model_1.default(400, "User id not defined");
        const addedAddress = yield (0, cart_service_1.addAddress)(userId, req.body);
        res.status(201).json({
            msg: "Address added",
            result: addedAddress
        });
    }
    catch (error) {
        next(error);
    }
}));
//edit address
router.put('/address/:addressId', validateToken_1.validateToken, (0, rbac_1.allow)(['Retailer']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addressId = Number(req.params.addressId);
        if (typeof addressId === undefined)
            throw new http_exception_model_1.default(400, "Address id is undefined");
        const updatedAddress = yield (0, cart_service_1.editAddress)(addressId, req.body);
        res.status(201).json({
            msg: "Address edited",
            result: updatedAddress
        });
    }
    catch (error) {
        next(error);
    }
}));
//delete address
router.delete('/address/:addressId', validateToken_1.validateToken, (0, rbac_1.allow)(['Retailer']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addressId = Number(req.params.addressId);
        if (typeof addressId === undefined)
            throw new http_exception_model_1.default(400, "Address id is undefined");
        const deletedAddress = yield (0, cart_service_1.deleteAddress)(addressId);
        res.status(201).json({
            msg: "Address deleted",
            result: deletedAddress
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
