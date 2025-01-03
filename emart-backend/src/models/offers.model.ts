export interface Offers{
    id: number,
    name: string,
    image: string | null,
    usersId: number,
    createdAt: Date;
    updatedAt: Date;
}

export type OfferCreatePayload = Pick<Offers, 'name'>
export type OfferResponse = Pick<Offers, 'id' | 'name' | 'image'>