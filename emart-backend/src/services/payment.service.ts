import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import HttpException from "../models/http-exception.model";
import { OrderQueryResponse } from "../models/order.model";
import { orderMapper } from "../mappers/order.mapper";
const paystack = require("paystack-api")(process.env.PAYSTACK_SECRET);

export const initializePayment = async (
    userId: number,
    orderDetails: { orderId: number }
) => {
    const { orderId } = orderDetails;
    if (!orderId) throw new HttpException(400, "Invalid orderId");

    const checkOrder = await prisma.orders.findUnique({
        where: {
            id: orderId,
            userId
        }
    })
    if (!checkOrder) throw new HttpException(404, "Order not found")

    const userDetail = await prisma.users.findUnique({
        where: { id: userId },
    });

    if (!userDetail) throw new HttpException(404, "User not found");

    const response = await paystack.transaction.initialize({
        email: userDetail.email,
        reference: orderId,
        amount: checkOrder.total,
    });
    return response
};

export const verifyPayment = async (reference: string) => {
    try {
        const response = await paystack.transaction.verify({
            reference
        })
        if (response.data.status == "success") {
            return ({
                data: response.data,
                message: response.message,
                status: response.status,
            });
        } else {
            return ({
                data: response.data,
                message: response.message,
                status: response.status,
            });
        }
    } catch (error) {
        if (error instanceof Error) throw new HttpException(400, error.message)
        throw new HttpException(400, error)
    }
}


//update payment status
export const updatePaymentStatus = async (orderId: number) => {
    const checkOrder = await prisma.orders.findUnique({
        where: {
            id: orderId
        }
    })

    if (!checkOrder) throw new HttpException(404, "No order found")

    await prisma.orders.update({
        where: {
            id: orderId
        },
        data: {
            payment_status: "Paid"
        },
        include: {
            order_items: true
        }
    })
}

//check payment status
export const checkPaymentStatus = async (orderId: number) => {
    const order = await prisma.orders.findUnique({
        where: { id: orderId },
    });

    if (!order) throw new HttpException(404, "Order not found")
    return order.payment_status
}