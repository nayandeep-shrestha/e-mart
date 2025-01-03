import { CartQueryResponse, CartResponse } from "../models/cart.model";

export const cartMapper = (cart: CartQueryResponse): CartResponse=> ({
  id: cart.id,
  cart_items: cart.cart_items,
  orderAddress: cart.orderAddress
});