"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderAddressMapper = void 0;
const orderAddressMapper = (address) => ({
    fullName: address.fullName,
    country: address.country,
    city: address.city,
    streetName: address.streetName,
    type: address.type
});
exports.orderAddressMapper = orderAddressMapper;
