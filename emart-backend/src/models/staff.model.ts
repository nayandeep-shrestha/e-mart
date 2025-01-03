import { Address } from "./address.model"

export interface Staff{
    id: number,
    storeId: number,
    name: string,
    phone: string,
    country: string,
    city: string,
    streetName: string,
    zipcode: number | null,
    address: Address
}

export type StaffCreatePayload = Omit<Staff, 'id'>

export type StaffResponse = Pick<Staff, 'storeId' | 'id' | 'name' | 'phone' | 'address'>

export type StaffQueryResponse = Omit<Staff, 'country' | 'city' |'zipcode' | 'streetName'>