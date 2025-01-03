import { OffersDataType } from '@/types';
import { axiosInstance } from './axiosInstance';

export default async function fetchOffersData(): Promise<OffersDataType[]> {
  const response = await axiosInstance.get<{ msg: string; result: any[] }>(
    '/offers',
  );
  const offers = response.data.result;
  return offers.map((offer) => ({
    key: offer.id,
    offerName: offer.name,
    image: offer.image,
  }));
}
