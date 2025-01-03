import { CartProducts } from "./cart_products.model";
import { OrderAddress } from "./order_address.model";

export interface Carts {
  id: number;
  userId?: number;
  cart_items: Pick<CartProducts, 'productId' | 'quantity' | 'subTotal' | 'product' | 'rate'>[]
  productId: number;
  quantity: number;
  orderAddress?: OrderAddress[]
}

export type CartCreatePayload = Pick<Carts, 'cart_items'>
export type CartQueryResponse = Omit<Carts, 'productId'| 'quantity'>
export type CartResponse = Pick<Carts, 'id' | 'cart_items' | 'orderAddress'>
