"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartMapper = void 0;
const cartMapper = (cart) => ({
    id: cart.id,
    cart_items: cart.cart_items,
    orderAddress: cart.orderAddress
});
exports.cartMapper = cartMapper;
