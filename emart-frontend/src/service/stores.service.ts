import { StoresDataType } from '@/types';
import { axiosInstance } from './axiosInstance';

export async function fetchStoresData(): Promise<StoresDataType[]> {
  const response = await axiosInstance.get<{ msg: string; result: any[] }>(
    '/stores',
  );
  const stores = response.data.result;
  return stores.map((store) => ({
    key: store.id,
    name: store.storeName,
    email: store.email,
    phoneNumber: store.phone,
    contactPerson: store.contactPerson,
    address: `${store.address.streetName}, ${store.address.city}`,
    pan: store.pan,
    status: store.status,
  }));
}

export async function updateStoreStatus(key: string): Promise<StoresDataType> {
  const response = await axiosInstance.patch<{ msg: string; result: any }>(
    `/stores/update-status/${key}`,
  );
  const stores = response.data.result;
  return {
    key: stores.id,
    name: stores.storeName,
    email: stores.email,
    phoneNumber: stores.phone,
    contactPerson: stores.contactPerson,
    address: `${stores.address.streetName}, ${stores.address.city}`,
    pan: stores.pan,
    status: stores.status,
  };
}

export async function updateStoreData(
  key: string,
  dataToUpdate: {
    name: string;
    address: string;
    contactPerson: string;
    phoneNumber: string;
  },
) {
  const response = await axiosInstance.patch<{ msg: string; result: any }>(
    `/stores/${key}`,
    {
      storeName: dataToUpdate.name,
      contactPerson: dataToUpdate.contactPerson,
      phone: dataToUpdate.phoneNumber,
      city: dataToUpdate.address.split(',')[1],
    },
  );

  const stores = response.data.result;
  return {
    key: stores.id,
    name: stores.storeName,
    email: stores.email,
    phoneNumber: stores.phone,
    contactPerson: stores.contactPerson,
    address: `${stores.address.streetName}, ${stores.address.city}`,
    pan: stores.pan,
    status: stores.status,
  };
}

export async function fetchStores(): Promise<
  { value: number; label: string }[]
> {
  const response = await axiosInstance.get<{
    msg: string;
    result: any[];
  }>('/stores');
  const stores = response.data.result.map((store) => ({
    value: store.id,
    label: store.storeName,
  }));
  stores.push({ value: 0, label: 'All Stores' });
  return stores;
}
