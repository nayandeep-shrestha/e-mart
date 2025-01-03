import { StoreUsersDataType } from '@/types';
import { axiosInstance } from './axiosInstance';

export default async function fetchStoreUsersData(): Promise<
  StoreUsersDataType[]
> {
  const response = await axiosInstance.get<{ msg: string; result: any[] }>(
    '/users/store-users',
  );
  const storeUsers = response.data.result;
  return storeUsers.map((user) => ({
    key: user.id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phone,
    companyName: user.companyName,
    address: `${user.address.streetName}, ${user.address.city}`,
    pan: user.pan,
    status: user.status,
  }));
}

export async function updateStoreUsersStatus(
  key: string,
): Promise<StoreUsersDataType> {
  const response = await axiosInstance.patch(
    `/users/update-store-users/${key}`,
  );
  const storeUser = response.data.result;
  return {
    key: storeUser.id,
    name: storeUser.name,
    email: storeUser.email,
    phoneNumber: storeUser.phone,
    companyName: storeUser.companyName,
    address: `${storeUser.address.streetName}, ${storeUser.address.city}`,
    pan: storeUser.pan,
    status: storeUser.status,
  };
}
