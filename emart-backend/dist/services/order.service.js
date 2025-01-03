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
exports.getOrdersReceivedByWholesaler = exports.cancelOrder = exports.updateOrderStatus = exports.getOrdersByUserId = exports.placeOrder = void 0;
const order_mapper_1 = require("../mappers/order.mapper");
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const cart_service_1 = require("./cart.service");
// import { PrismaClient } from "@prisma/client";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
//CRUD for Orders;
//create Order
const placeOrder = (input, userId, addresssId) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof input == "undefined")
        throw new http_exception_model_1.default(400, "Data not defined");
    const { description } = input;
    const checkAddress = yield prisma.order_Address.findUnique({
        where: {
            id: addresssId
        }
    });
    if (!checkAddress)
        throw new http_exception_model_1.default(404, "Address not found");
    const cartDetails = yield prisma.carts.findUnique({
        where: { userId },
        include: {
            carts_items: true
        }
    });
    if (!cartDetails || cartDetails.carts_items.length <= 0)
        throw new http_exception_model_1.default(404, "Cart details not found");
    const addOrder = yield prisma.$transaction(() => __awaiter(void 0, void 0, void 0, function* () {
        const orders = yield prisma.orders.create({
            data: {
                userId: userId,
                total: cartDetails.carts_items.map((item) => item.subTotal).reduce((acc, current) => acc + current, 0),
                address: {
                    fullName: checkAddress.fullName,
                    country: checkAddress.country,
                    city: checkAddress.city,
                    streetName: checkAddress.streetName,
                }
            },
        });
        yield prisma.order_Items.createMany({
            data: cartDetails.carts_items.map((item) => {
                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    subTotal: item.subTotal,
                    orderId: orders.id,
                };
            }),
            skipDuplicates: true,
        });
        yield prisma.stocks.createMany({
            data: cartDetails.carts_items.map((item) => {
                return {
                    productId: item.productId,
                    quantity: -item.quantity,
                };
            }),
            skipDuplicates: true,
        });
        const comments = yield prisma.comments.create({
            data: {
                orderId: orders.id,
                description,
            },
        });
        yield (0, cart_service_1.clearCart)(userId);
        return {
            id: orders.id,
            user_id: orders.userId,
            status: orders.status,
            total: orders.total,
            order_items: cartDetails.carts_items,
            comments: comments,
            shipping: orders.address,
            payStatus: orders.payment_status
        };
    }));
    return addOrder;
});
exports.placeOrder = placeOrder;
//get Order details by ID
// export const getOrderById = async (id: number): Promise<OrderResponse> => {
//   const orderData: OrderQueryResponse = await prisma.orders.findUnique({
//     where: { id },
//     include: {
//       order_items: true,
//       comments: true,
//     },
//   });
//   if (!orderData) throw new HttpException(404, "Order not found");
//   return orderMapper(orderData);
// };
//get order list of user
const getOrdersByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const checkUser = yield prisma.users.findUnique({
        where: {
            id: userId,
        },
    });
    if (!checkUser)
        throw new http_exception_model_1.default(404, "User not found");
    const ordersList = yield prisma.orders.findMany({
        where: {
            userId,
        },
        include: {
            order_items: true,
            comments: true,
        },
    });
    if (ordersList.length === 0)
        throw new http_exception_model_1.default(404, "No orders yet");
    return (0, order_mapper_1.orderListMapper)(ordersList);
});
exports.getOrdersByUserId = getOrdersByUserId;
//update order status
const updateOrderStatus = (orderId, orderStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const checkOrder = yield prisma.orders.findUnique({
        where: { id: orderId },
        include: { order_items: true },
    });
    if (!checkOrder)
        throw new http_exception_model_1.default(404, "Order to be updated not found");
    if (orderStatus === "Cancelled")
        throw new http_exception_model_1.default(400, "Invalid order status");
    const updatedOrder = yield prisma.orders.update({
        where: {
            id: orderId,
        },
        data: {
            status: orderStatus,
        },
        include: {
            order_items: true,
            comments: true,
        },
    });
    if (!updatedOrder)
        throw new http_exception_model_1.default(400, "Order status update failed");
    return (0, order_mapper_1.orderMapper)(updatedOrder);
});
exports.updateOrderStatus = updateOrderStatus;
//cancel order
const cancelOrder = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const checkOrder = yield prisma.orders.findUnique({
        where: { id: orderId },
        include: { order_items: true },
    });
    if (!checkOrder)
        throw new http_exception_model_1.default(404, "Order to be updated not found");
    const cancelledOrder = yield prisma.$transaction(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.stocks.createMany({
            data: checkOrder.order_items.map((item) => ({
                productId: item.productId,
                quantity: Math.abs(item.quantity),
            })),
        });
        const orderData = yield prisma.orders.update({
            where: {
                id: orderId,
            },
            data: {
                status: "Cancelled",
            },
            include: {
                order_items: true,
                comments: true,
            },
        });
        return orderData;
    }));
    if (!cancelledOrder)
        throw new http_exception_model_1.default(400, "Order status update failed");
    return (0, order_mapper_1.orderMapper)(cancelledOrder);
});
exports.cancelOrder = cancelOrder;
//get orders received by wholesaler
const getOrdersReceivedByWholesaler = (wholesalerId) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield prisma.orders.findMany({
        where: {
            order_items: {
                some: {
                    product: {
                        stores: {
                            userId: wholesalerId,
                        },
                    },
                },
            },
        },
        include: {
            order_items: {
                include: {
                    product: {
                        include: {
                            stores: true,
                        },
                    },
                },
            },
            comments: true,
        },
    });
    if (!orders || orders.length === 0)
        throw new http_exception_model_1.default(404, "No orders found");
    const filteredOrders = orders.map((order) => {
        var _a;
        const filteredOrderItems = order.order_items.filter((orderItem) => orderItem.product.stores.userId === wholesalerId);
        return {
            orderId: order.id,
            status: order.status,
            userId: order.userId,
            pay_status: order.payment_status,
            description: (_a = order.comments) === null || _a === void 0 ? void 0 : _a.description,
            order_items: filteredOrderItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
        };
    });
    return filteredOrders;
});
exports.getOrdersReceivedByWholesaler = getOrdersReceivedByWholesaler;
