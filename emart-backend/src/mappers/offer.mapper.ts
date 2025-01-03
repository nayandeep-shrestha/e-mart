import { OfferResponse, Offers } from "../models/offers.model";

export const offerMapper = async ( offer: Offers) : Promise<OfferResponse> =>({
    id: offer.id,
    name: offer.name,
    image: offer.image,
})

export const offerListMapper = async (offersList : Offers[]) : Promise<OfferResponse[]> => {
    return offersList.map( offer => ({
        id: offer.id,
        name: offer.name,
        image: offer.image
    }))
}