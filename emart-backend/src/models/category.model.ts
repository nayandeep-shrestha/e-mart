import { Store } from "./store.model";

export interface Category{
    id: number;
    name: string;
    status: 'Active' | 'Inactive',
    // storeId: number;
    createdAt: Date;
    updatedAt: Date;
}

export type CategoryCreatePayload = Pick<Category, 'name' | 'status'>
export type CategoryQueryResponse = Omit<Category, 'storeName'>

export type CategoryResponse = Pick<Category,'id' |'name' | 'status'>