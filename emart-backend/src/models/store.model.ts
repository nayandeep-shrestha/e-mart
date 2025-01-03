import { Users } from "@prisma/client";
import { Address } from "./address.model"

export interface Store {
    id:number,
    storeName: string,
    pan: string,
    country: string,
    city: string,
    streetName: string,
    zipcode: number|null,
    userId?: number,
    users: Users,
    address: Address,
    addressId: number
    status: 'Active' | 'Inactive';
    email: string,
    phone: string,
    contactPerson: string,
}

export type StoreCreatePayload = Pick<Store, 'storeName' | 'pan'>

export type StoreQueryResponse = Omit<Store, 'country' | 'city' |'zipcode' | 'streetName' | 'email' | 'phone' | 'contactPerson'>

export type StoreResponse = Pick<Store, 'userId' | 'id' | 'storeName' | 'pan' | 'address' | 'status' | 'contactPerson' | 'email' | 'phone'>