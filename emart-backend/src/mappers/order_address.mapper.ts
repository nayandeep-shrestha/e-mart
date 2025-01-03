import { OrderAddressQueryResponse, OrderAddressResponse } from "../models/order_address.model";

export const orderAddressMapper = ( address: OrderAddressQueryResponse) : OrderAddressResponse=> ({
    id: address.id,
    fullName: address.fullName,
    country: address.country,
    city: address.city,
    streetName: address.streetName,
    type: address.type
 })