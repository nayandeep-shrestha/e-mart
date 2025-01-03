import { UserLoginResponse, UserQueryResponse, UserResponse } from "../models/user.model";


export const userMapper = (user: UserQueryResponse): UserResponse => ({
    id: user.id,
    role: user.roles.title,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    status: user.status,
    managerId: user.managerId
})

export const userLoginMapper = (user: any): UserLoginResponse => ({
    role: user.roles.title,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    accessToken: user.accessToken,
    refreshToken: user.refreshToken
})

export const userListMapper = (userList: UserQueryResponse[]): UserResponse[] => (
    userList.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.roles.title,
        status: user.status,
        managerId: user.managerId
    }))
)

export const storeUserMapper = (storeUser: any) => (
    {
        id: storeUser.id,
        name: storeUser.name,
        email: storeUser.email,
        phone: storeUser.phone,
        role: storeUser.roles.title,
        address: storeUser.manager.address,
        status: storeUser.status,
        managerId: storeUser.managerId,
        companyName: storeUser.manager.stores.storeName,
        pan: storeUser.manager.stores.pan
    }
)
export const storeUsersListMapper = (storeUserList: any) => (
    storeUserList.map((storeUser: any) => ({
        id: storeUser.id,
        name: storeUser.name,
        email: storeUser.email,
        phone: storeUser.phone,
        role: storeUser.roles.title,
        address: storeUser.manager.address,
        status: storeUser.status,
        managerId: storeUser.managerId,
        companyName: storeUser.manager.stores.storeName,
        pan: storeUser.manager.stores.pan
    }))
)