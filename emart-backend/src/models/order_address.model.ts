export interface OrderAddress{
    id: number;
    cartId: number;
    fullName: string;
    country: string;
    city: string;
    streetName: string;
    type: 'Shipping' | 'Billing'
}

export type OrderAddressCreatePayload = Omit<OrderAddress, 'id' | 'cartId'>
export type OrderAddressQueryResponse = OrderAddress
export type OrderAddressResponse = Omit<OrderAddress, 'cartId'>