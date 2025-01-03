import { Products } from "./product.model";

export interface CartProducts{
    id: number;
    productId: number;
    quantity: number;
    subTotal: number;
    cartId: number;
    rate: number;
    product?: Products
}