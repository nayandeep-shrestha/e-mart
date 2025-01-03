import { Products } from "./product.model";
import { Store } from "./store.model";

export interface OrderItems {
    id: number;
    productId: number;
    quantity: number;
    orderId: number;
    product?: Products
  }