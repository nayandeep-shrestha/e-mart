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
exports.checkPaymentStatus = exports.updatePaymentStatus = exports.verifyPayment = exports.initializePayment = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const paystack = require("paystack-api")(process.env.PAYSTACK_SECRET);
const initializePayment = (userId, orderDetails) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = orderDetails;
    if (!orderId)
        throw new http_exception_model_1.default(400, "Invalid orderId");
    const checkOrder = yield prisma.orders.findUnique({
        where: {
            id: orderId,
            userId
        }
    });
    if (!checkOrder)
        throw new http_exception_model_1.default(404, "Order not found");
    const userDetail = yield prisma.users.findUnique({
        where: { id: userId },
    });
    if (!userDetail)
        throw new http_exception_model_1.default(404, "User not found");
    const response = yield paystack.transaction.initialize({
        email: userDetail.email,
        reference: orderId,
        amount: checkOrder.total,
    });
    return response;
});
exports.initializePayment = initializePayment;
const verifyPayment = (reference) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield paystack.transaction.verify({
            reference
        });
        if (response.data.status == "success") {
            return ({
                data: response.data,
                message: response.message,
                status: response.status,
            });
        }
        else {
            return ({
                data: response.data,
                message: response.message,
                status: response.status,
            });
        }
    }
    catch (error) {
        if (error instanceof Error)
            throw new http_exception_model_1.default(400, error.message);
        throw new http_exception_model_1.default(400, error);
    }
});
exports.verifyPayment = verifyPayment;
//update payment status
const updatePaymentStatus = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const checkOrder = yield prisma.orders.findUnique({
        where: {
            id: orderId
        }
    });
    if (!checkOrder)
        throw new http_exception_model_1.default(404, "No order found");
    yield prisma.orders.update({
        where: {
            id: orderId
        },
        data: {
            payment_status: "Paid"
        },
        include: {
            order_items: true
        }
    });
});
exports.updatePaymentStatus = updatePaymentStatus;
//check payment status
const checkPaymentStatus = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield prisma.orders.findUnique({
        where: { id: orderId },
    });
    if (!order)
        throw new http_exception_model_1.default(404, "Order not found");
    return order.payment_status;
});
exports.checkPaymentStatus = checkPaymentStatus;
