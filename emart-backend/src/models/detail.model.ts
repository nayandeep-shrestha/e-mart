export interface Details{
    id: number;
    name: string;
    description: string | null;
    price: number;
    code: string;
    tags: string |null;
    productId: number;
    createdAt: Date;
    updatedAt: Date;
}