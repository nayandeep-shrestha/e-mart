import { Comments } from "./comments.model";
import { OrderItems } from "./order_items.model";

export interface Orders {
  id: number;
  userId: number;
  order_items: Pick<OrderItems, "productId" | "quantity" | "product">[];
  comments?: Comments;
  description?: string;
  quantity: number;
  productId: number;
  payment_status: string;
  status: 'Pending' | 'Dispatched' | 'Cancelled';
}

export type OrderCreatePayload = Pick<
  Orders,
  "order_items" | "description"
>;

export type OrderResponse = Pick<
  Orders,
  "id" | "order_items" | "description" | "status" | "payment_status"
>;

export type OrderQueryResponse = Omit<
  Orders,
  "description" | "quantity" | "productId"
>;
