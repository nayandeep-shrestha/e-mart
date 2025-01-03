import { Prisma } from "@prisma/client";
import { orderListMapper, orderMapper } from "../mappers/order.mapper";
import HttpException from "../models/http-exception.model";
import { OrderQueryResponse, OrderResponse } from "../models/order.model";
import { clearCart } from "./cart.service";
import { formatDateTimeToYYYYMMDDHHMM } from "../utils/dateConvert";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//create Order
export const placeOrder = async (
  input: { description: string; addressId: number },
  userId: number
): Promise<OrderResponse> => {
  if (typeof input == "undefined")
    throw new HttpException(400, "Data not defined");
  const { description, addressId } = input;

  const checkAddress = await prisma.order_Address.findUnique({
    where: {
      id: addressId,
    },
  });
  if (!checkAddress) throw new HttpException(404, "Address not found");

  const cartDetails = await prisma.carts.findUnique({
    where: { userId },
    include: {
      carts_items: true,
    },
  });
  if (!cartDetails || cartDetails.carts_items.length <= 0)
    throw new HttpException(404, "Cart details not found");

  const addOrder = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const orders = await tx.orders.create({
        data: {
          userId: userId,
          total: cartDetails.carts_items
            .map((item: any) => item.subTotal)
            .reduce((acc: number, current: number) => acc + current, 0),
          address: {
            fullName: checkAddress.fullName,
            country: checkAddress.country,
            city: checkAddress.city,
            streetName: checkAddress.streetName,
            type: checkAddress.type,
          },
        },
      });
      await tx.order_Items.createMany({
        data: cartDetails.carts_items.map((item: any) => {
          return {
            productId: item.productId,
            quantity: item.quantity,
            subTotal: item.subTotal,
            rate: item.rate,
            orderId: orders.id,
          };
        }),
        skipDuplicates: true,
      });

      await tx.stocks.createMany({
        data: cartDetails.carts_items.map((item: any) => {
          return {
            productId: item.productId,
            quantity: -item.quantity,
          };
        }),
        skipDuplicates: true,
      });

      const comments = await tx.comments.create({
        data: {
          orderId: orders.id,
          description,
        },
      });

      await clearCart(userId);
      return {
        id: orders.id,
        user_id: orders.userId,
        status: orders.status,
        total: orders.total,
        order_items: cartDetails.carts_items,
        comments: comments,
        address: orders.address,
        payStatus: orders.payment_status,
      };
    }
  );

  return addOrder;
};

//get order list of retailer
export const getOrdersByUserId = async (
  userId: number
): Promise<OrderResponse[]> => {
  const checkUser = await prisma.users.findUnique({
    where: {
      id: userId,
    },
  });

  if (!checkUser) throw new HttpException(404, "User not found");

  const ordersList: OrderQueryResponse[] = await prisma.orders.findMany({
    where: {
      userId,
    },
    include: {
      order_items: true,
      comments: true,
    },
  });
  if (ordersList.length === 0) throw new HttpException(404, "No orders yet");
  return orderListMapper(ordersList);
};

//update order status
export const updateOrderStatus = async (
  orderId: number,
  orderStatus: string,
  userId: number,
  userRole: string
): Promise<OrderResponse> => {
  if (userRole === "admin" || userRole == "staff") {
    const checkUser = await prisma.users.findUnique({
      where: { id: userId },
      include: { manager: { include: { roles: true } } },
    });
    if (checkUser?.manager?.roles.title !== "super admin")
      throw new HttpException(401, "Unauthorized access");
  }

  const checkOrder = await prisma.orders.findUnique({
    where: { id: orderId },
    include: { order_items: true },
  });
  if (!checkOrder)
    throw new HttpException(404, "Order to be updated not found");

  if (orderStatus === "Cancelled")
    throw new HttpException(400, "Invalid order status");

  const updatedOrder: OrderQueryResponse = await prisma.orders.update({
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

  if (!updatedOrder) throw new HttpException(400, "Order status update failed");

  return orderMapper(updatedOrder);
};

//update pay status
export const updatePayStatus = async (
  orderId: number,
  userId: number,
  userRole: string
)=> {
  if (userRole === "admin" || userRole == "staff") {
    const checkUser = await prisma.users.findUnique({
      where: { id: userId },
      include: { manager: { include: { roles: true } } },
    });
    if (checkUser?.manager?.roles.title !== "super admin")
      throw new HttpException(401, "Unauthorized access");
  }

  const checkOrder = await prisma.orders.findUnique({
    where: { id: orderId },
    include: { order_items: true },
  });
  if (!checkOrder)
    throw new HttpException(404, "Order to be updated not found");

  if(checkOrder.payment_status === "Paid") throw new HttpException(400, "Invalid request")

  await prisma.orders.update({
    where: {
      id: orderId,
    },
    data: {
      payment_status: "Paid",
    }
  });
};
//cancel order
export const cancelOrder = async (
  orderId: number,
  userId: number,
  userRole: string
): Promise<OrderResponse> => {
  if (userRole === "admin" || userRole == "staff") {
    const checkUser = await prisma.users.findUnique({
      where: { id: userId },
      include: { manager: { include: { roles: true } } },
    });
    if (checkUser?.manager?.roles.title !== "super admin")
      throw new HttpException(401, "Unauthorized access");
  }

  const checkOrder = await prisma.orders.findUnique({
    where: { id: orderId },
    include: { order_items: true },
  });
  if (!checkOrder)
    throw new HttpException(404, "Order to be updated not found");

  const cancelledOrder: OrderQueryResponse = await prisma.$transaction(
    async () => {
      await prisma.stocks.createMany({
        data: checkOrder.order_items.map(
          (item: { productId: number; quantity: number }) => ({
            productId: item.productId,
            quantity: Math.abs(item.quantity),
          })
        ),
      });
      const orderData = await prisma.orders.update({
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
    }
  );
  if (!cancelledOrder)
    throw new HttpException(400, "Order status update failed");
  return orderMapper(cancelledOrder);
};

//fetch all orders received
export const getOrdersReceived = async (userId: number, userRole: string) => {
  if (userRole === "admin" || userRole == "staff") {
    const checkUser = await prisma.users.findUnique({
      where: { id: userId },
      include: { manager: { include: { roles: true } } },
    });
    if (checkUser?.manager?.roles.title !== "super admin")
      throw new HttpException(401, "Unauthorized access");
  }

  const orders = await prisma.orders.findMany({
    include: {
      users: {
        include: {
          stores: {
            include: {
              address: true,
            },
          },
        },
      },
      order_items: {
        include: {
          product: { include: { details: true } },
        },
      },
    },
  });

  const groupedOrders: { [key: number]: StoreOrders } = {};

  orders.forEach((order:any) => {
    const storeId = order.users.stores.id;
    const store = order.users.stores;

    if (!groupedOrders[storeId]) {
      groupedOrders[storeId] = {
        storeName: store.storeName,
        contactNumber: order.users.phone,
        contactPerson: order.users.name,
        address: store.address.streetName + ',' + store.address.city,
        pan: store.pan,
        pending: 0,
        dispatched: 0,
        details: [],
      };
    }

    const storeOrder = groupedOrders[storeId];

    if (order.status === "Pending") {
      storeOrder.pending += 1;
    } else if (order.status === "Dispatched") {
      storeOrder.dispatched += 1;
    }

    
    const orderDateTime = formatDateTimeToYYYYMMDDHHMM(order.createdAt);

    let dateTimeGroup = storeOrder.details.find(d => d.dateTime === orderDateTime);

    if (!dateTimeGroup) {
      dateTimeGroup = {
        id: order.id,
        dateTime: orderDateTime,
        orders: [],
        orderStatus: order.status,
        paymentStatus: order.payment_status
      };
      storeOrder.details.push(dateTimeGroup);
    } else {
      // Update status only if the new status is more severe
      if (dateTimeGroup.orderStatus === 'Pending' && order.status === 'Dispatched') {
        dateTimeGroup.orderStatus = 'Dispatched';
      }
      if (dateTimeGroup.paymentStatus === 'Pending' && order.payment_status === 'Completed') {
        dateTimeGroup.paymentStatus = 'Completed';
      }
    }

    order.order_items.forEach((item: any) => {
      dateTimeGroup.orders.push({
        item: item.product.details.name,
        qty: item.quantity,
        rate: item.rate,
        total: item.quantity * item.rate,
      });
    });
  });

  // Ensure details are sorted by date and time
  Object.values(groupedOrders).forEach(store => {
    store.details.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  });

  return Object.values(groupedOrders);
};

interface OrderDetails {
  item: string;
  qty: number;
  rate: number;
  total: number;
}

interface StoreOrderDetailsByDateTime {
  id: number;
  dateTime: string;
  orders: OrderDetails[];
  orderStatus: string;
  paymentStatus: string;
}

interface StoreOrders {
  storeName: string;
  contactNumber: string;
  contactPerson: string;
  address: string;
  pan: string;
  pending: number;
  dispatched: number;
  details: StoreOrderDetailsByDateTime[];
}

