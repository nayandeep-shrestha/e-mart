export interface Address{
    id: number;
    country: string;
    city: string;
    streetName: string,
    zipcode: number | null;
    createdAt: Date;
    updatedAt: Date;
}