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
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const payment_service_1 = require("../services/payment.service");
const crypto_1 = __importDefault(require("crypto"));
const router = (0, express_1.Router)();
router.post('/initialize-payment', validateToken_1.validateToken, (0, rbac_1.allow)(['Retailer']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId)
            throw new http_exception_model_1.default(400, "User id not defined");
        const paymentResponse = yield (0, payment_service_1.initializePayment)(userId, req.body);
        res.status(201).json(paymentResponse);
    }
    catch (error) {
        next(error);
    }
}));
router.get('/verify/:reference', validateToken_1.validateToken, (0, rbac_1.allow)(['Retailer']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reference = req.params.reference;
        if (!reference)
            throw new http_exception_model_1.default(400, "Invalid reference");
        const verification = yield (0, payment_service_1.verifyPayment)(reference);
        res.status(200).json(verification);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/paystack-webhook', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hash = crypto_1.default.createHmac('sha512', process.env.PAYSTACK_SECRET)
            .update(JSON.stringify(req.body))
            .digest('hex');
        // Verify webhook signature
        if (hash === req.headers['x-paystack-signature']) {
            const event = req.body;
            // Handle different event types
            switch (event.event) {
                case 'charge.success':
                    (0, payment_service_1.updatePaymentStatus)(Number(event.data.reference));
                    res.status(201).json({
                        msg: "Payment success"
                    });
                    // Handle successful charge
                    break;
                case 'charge.failed':
                    res.status(400).json({
                        msg: "Transaction failed"
                    });
                    // Handle failed charge
                    break;
                // Add more cases for other event types as needed
                default:
                    console.log('Unhandled event type:', event.event);
            }
        }
        else {
            // Invalid webhook signature
            res.status(401).json('Invalid webhook signature');
        }
    }
    catch (error) {
        next(error);
    }
}));
router.get('/payment-status/:orderId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        if (!orderId)
            throw new http_exception_model_1.default(400, "Order id is not defined");
        const payStatus = yield (0, payment_service_1.checkPaymentStatus)(Number(orderId));
        res.status(200).json({
            msg: "payment status fetched",
            result: payStatus
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
