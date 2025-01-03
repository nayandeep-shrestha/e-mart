import { BannersDataType } from '@/types';
import { axiosInstance } from './axiosInstance';

export async function fetchBannersData(): Promise<BannersDataType[]> {
  const response = await axiosInstance.get<{
    msg: string;
    result: { banner: any[] };
  }>('/banners');
  const banners = response.data.result;
  return banners.banner.map((banner) => ({
    key: banner.id,
    bannerName: banner.name,
    image: banner.imageLink,
  }));
}

export async function deleteBanner(bannerId: number): Promise<string> {
  const response = await axiosInstance.delete(`/banners/${bannerId}`);
  return response.data.msg;
}

export async function addBanner(bannerName: string): Promise<String> {
  const response = await axiosInstance.post('/banners', { name: bannerName });
  return response.data.msg;
}
