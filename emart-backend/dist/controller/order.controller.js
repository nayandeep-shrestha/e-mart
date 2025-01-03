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
const rbac_1 = require("../middleware/rbac");
const validateToken_1 = require("../middleware/validateToken");
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const order_service_1 = require("../services/order.service");
const express_1 = require("express");
const router = (0, express_1.Router)();
//place a order
router.post("/:addressId", validateToken_1.validateToken, (0, rbac_1.allow)(['Retailer']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (typeof userId == "undefined")
            throw new http_exception_model_1.default(400, 'Data not defined');
        const addressId = Number(req.params.addressId);
        if (typeof addressId == "undefined")
            throw new http_exception_model_1.default(400, 'Address not defined');
        const createdOrder = yield (0, order_service_1.placeOrder)(req.body, userId, addressId);
        if (!createdOrder) {
            throw new http_exception_model_1.default(400, "Order creation failed");
        }
        res.status(201).json({
            msg: "Order Created",
            result: createdOrder,
        });
    }
    catch (error) {
        next(error);
    }
}));
//get order details by order id
// router.get( "/:orderId", validateToken,  async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const orderId = parseInt(req.params.orderId);
//       if (!orderId) throw new HttpException(400, "Order id not found");
//       const order = await getOrderById(orderId);
//       res.status(201).json({
//         msg: "Order details fetched",
//         result: order,
//       });
//     } catch (error) {
//       console.log(error);
//       next(error);
//     }
//   }
// );
//update order status
router.patch('/:orderId/updateStatus', validateToken_1.validateToken, (0, rbac_1.allow)(['Admin', 'Wholesaler']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = Number(req.params.orderId);
        const { status } = req.body;
        if (!status)
            throw new http_exception_model_1.default(400, "Status can't be blank");
        const updatedOrderStatus = yield (0, order_service_1.updateOrderStatus)(orderId, status);
        res.status(201).json({
            msg: "Order status updated",
            result: updatedOrderStatus
        });
    }
    catch (error) {
        next(error);
    }
}));
//cancel order
router.post('/:orderId/cancelOrder', validateToken_1.validateToken, (0, rbac_1.allow)(['Admin', 'Wholesaler']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = Number(req.params.orderId);
        if (typeof orderId === undefined)
            throw new http_exception_model_1.default(400, "Order id is not defined");
        const cancelledOrder = yield (0, order_service_1.cancelOrder)(orderId);
        res.status(201).json({
            msg: "Order Cancelled",
            result: cancelledOrder
        });
    }
    catch (error) {
        next(error);
    }
}));
//get order list by user id
router.get('/', validateToken_1.validateToken, (0, rbac_1.allow)(['Retailer']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (typeof userId === undefined)
            throw new http_exception_model_1.default(400, "User id not defined");
        const orderList = yield (0, order_service_1.getOrdersByUserId)(userId);
        res.status(200).json({
            msg: "Order list fetched",
            result: orderList
        });
    }
    catch (error) {
        next(error);
    }
}));
//get orders recieved by wholesaler
router.get('/lists/wholesaler', validateToken_1.validateToken, (0, rbac_1.allow)(['Wholesaler']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wholesalerId = req.userId;
        if (typeof wholesalerId === undefined)
            throw new http_exception_model_1.default(400, "Id not defined");

        const orderList = yield (0, order_service_1.getOrdersReceivedByWholesaler)(wholesalerId);
        res.status(200).json({
            msg: "Orders fetched",
            result: orderList
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
