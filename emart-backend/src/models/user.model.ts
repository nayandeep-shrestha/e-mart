import { Address } from "./address.model";
import { Role } from "./role.model";

export interface Users{
    id:number,
    roleId: number,
    roles: Role,
    role: string, 
    name: string,
    email: string ,
    password: string ,
    status: 'Active' | 'Inactive',
    phone: string ,
    country: string,
    city: string ,
    streetName: string
    zipcode: number |null,
    managerId: number | null,
    address?: Address |null,
    accessToken: string,
    refreshToken: string,
    wholesalerId?: number,
}


export type UserCreatePayload = Omit<Users, 'addressId' | 'address' | 'id' | 'roles' | 'status' | 'managerId'>;

export type UserResponse = Pick<Users, 'name' |'email' | 'phone' | 'address' | 'role' |'status' | 'id' | 'managerId'>

export type UserQueryResponse = Omit<Users,'country' | 'city' |'zipcode' | 'accessToken' | 'refreshToken' | 'role' | 'streetName'>

export type UserLoginPayload = Pick<Users, 'email' | 'password'>
export type UserLoginResponse = Pick<Users, 'name' |'email' | 'phone' | 'address' | 'role' | 'accessToken' | 'refreshToken'>

export type Profile = Pick<Users, 'name' |'email' | 'phone' | 'address' | 'roles' | 'status'>

export type UserUpdatePayload = Pick<Users, 'roleId' | 'name' | 'phone'>