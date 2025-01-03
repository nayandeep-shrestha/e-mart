import { OrderQueryResponse, OrderResponse } from "../models/order.model";

export const orderMapper = (
  order: OrderQueryResponse
): OrderResponse => ({
    id:order.id,
    order_items: order.order_items,
    description: order.comments?.description,
    status: order.status,
    payment_status: order.payment_status
});

export const orderListMapper = (orderList: OrderQueryResponse[]) : OrderResponse[]=> (
  orderList.map(order => ({
    id: order.id,
    userId:order.userId,
    order_items: order.order_items,
    description: order.comments?.description,
    status: order.status,
    payment_status: order.payment_status
  }))
)

