import { PrismaClient, Prisma, Roles } from "@prisma/client";
const prisma = new PrismaClient();
import HttpException from "../models/http-exception.model";
import { formatDateTimeToYYYYMMDDHHMM } from "../utils/dateConvert";
import { TransactionParentDataType } from "../models/transaction.model";

export const fetchTransactionHistory = async (
    userId: number,
    userRole: string
) => {
    if (userRole === "admin") {
        const checkUser = await prisma.users.findUnique({
            where: { id: userId },
            include: { manager: { include: { roles: true } } },
        });
        if (checkUser?.manager?.roles.title !== "super admin")
            throw new HttpException(401, "Unauthorized access");
    }

    const transactions = await prisma.orders.findMany({
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
                    product: { include: { details: true, images: true, uom: true } },
                },
            },
        },
    });

    const groupedTransactions: { [key: number]: TransactionParentDataType } = {};
    transactions.filter(order => order.payment_status === "Paid")
        .forEach((order: any) => {
            const storeId = order.users.stores.id;
            const store = order.users.stores;

            if (!groupedTransactions[storeId]) {
                groupedTransactions[storeId] = {
                    storeName: store.storeName,
                    address: store.address.streetName + "," + store.address.city,
                    email: order.users.email,
                    pan: store.pan,
                    phone: order.users.phone,
                    contactPerson: order.users.name,
                    children: [],
                };
            }

            const storeOrder = groupedTransactions[storeId];

            const orderDateTime = formatDateTimeToYYYYMMDDHHMM(order.createdAt);

            let dateTimeGroup = storeOrder.children.find(
                (d) => d.dateTime === orderDateTime
            );

            if (!dateTimeGroup) {
                dateTimeGroup = {
                    dateTime: orderDateTime,
                    status: order.status.toLowerCase() !== "dispatched" ? "Paid" : "Dispatched",
                    total: order.total,
                    children: [],
                };
                storeOrder.children.push(dateTimeGroup);
            }

            order.order_items.forEach((item: any) => {
                dateTimeGroup.children.push({
                    image: item.product.images.path,
                    item: item.product.details.name,
                    qty: item.quantity,
                    price: item.rate,
                    uom: Object.keys(item.product.uom).find(k => item.product.uom[k] === item.rate) || 'no match',
                });
            });
        });
    Object.values(groupedTransactions).forEach(store => {
        store.children.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    });

    return Object.values(groupedTransactions);
};

