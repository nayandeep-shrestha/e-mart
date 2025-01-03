import { StoreQueryResponse, StoreResponse } from "../models/store.model";

export const storeMapper = async (
  store: StoreQueryResponse
): Promise<StoreResponse> => ({
  id: store.id,
  storeName: store.storeName,
  pan: store.pan,
  email: store.users.email,
  phone: store.users.phone,
  contactPerson: store.users.name,
  address: store.address,
  status: store.status,
});

export const storeLisMapper = (
  storeList: StoreQueryResponse[]
): StoreResponse[] =>
  storeList.map((store) => ({
    id: store.id,
    userId: store.userId,
    storeName: store.storeName,
    pan: store.pan,
    email: store.users.email,
    phone: store.users.phone,
    contactPerson: store.users.name,
    address: store.address,
    status: store.status,
  }));
