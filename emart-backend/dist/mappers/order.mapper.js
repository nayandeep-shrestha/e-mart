"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderListMapper = exports.orderMapper = void 0;
const orderMapper = (order) => {
    var _a;
    return ({
        id: order.id,
        order_items: order.order_items,
        description: (_a = order.comments) === null || _a === void 0 ? void 0 : _a.description,
        status: order.status,
        payment_status: order.payment_status
    });
};
exports.orderMapper = orderMapper;
const orderListMapper = (orderList) => (orderList.map(order => {
    var _a;
    return ({
        id: order.id,
        userId: order.userId,
        order_items: order.order_items,
        description: (_a = order.comments) === null || _a === void 0 ? void 0 : _a.description,
        status: order.status,
        payment_status: order.payment_status
    });
}));
exports.orderListMapper = orderListMapper;
