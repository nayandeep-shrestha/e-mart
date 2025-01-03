import { PrismaClient } from "@prisma/client";
import {
  StoreCreatePayload,
  StoreQueryResponse,
  StoreResponse,
} from "../models/store.model";
import HttpException from "../models/http-exception.model";
import { storeLisMapper, storeMapper } from "../mappers/store.mapper";
const prisma = new PrismaClient();

export const createStore = async (
  storeData: StoreCreatePayload,
  userId: number
): Promise<StoreResponse> => {
  if (typeof storeData === "undefined")
    throw new HttpException(400, "Data is not defined");

  if (!storeData.storeName) throw new HttpException(400, "Empty store name");
  if (!storeData.pan) throw new HttpException(400, "Empty pan value");

  const existingStore = await prisma.stores.findUnique({
    where: {
      pan: storeData.pan,
    },
  });
  if (existingStore) throw new HttpException(400, "Pan already exists");

  const checkRetailer = await prisma.users.findUnique({
    where: { id: userId },
    include: { address: true },
  });
  if (!checkRetailer) throw new HttpException(400, "User not created");

  const createdStoreData: StoreQueryResponse = await prisma.stores.create({
    data: {
      storeName: storeData.storeName,
      pan: storeData.pan,
      userId: userId,
      addressId: checkRetailer.address!.id,
    },
    include: {
      address: true,
      users: true,
    },
  });

  return storeMapper(createdStoreData);
};

export const fetchAllStores = async (userId: number, role: string) => {
  if (role === "admin") {
    const checkUser = await prisma.users.findUnique({
      where: { id: userId },
      include: { manager: { include: { roles: true } } },
    });
    if (checkUser?.manager?.roles.title !== "super admin")
      throw new HttpException(401, "Unauthorized access");
    const storesList: StoreQueryResponse[] = await prisma.stores.findMany({
      include: { address: true, users: true },
    });
    return storeLisMapper(storesList);
  }

  const storesList: StoreQueryResponse[] = await prisma.stores.findMany({
    include: { address: true, users: true },
  });
  return storeLisMapper(storesList);
};

export const updateStoreById = async (
  storeId: number,
  storeData: any,
  userId: number,
  role: string
) => {
  if (typeof storeData === "undefined")
    throw new HttpException(400, "Data is not defined");
  const {
    storeName,
    country,
    city,
    streetName,
    zipcode,
    phone,
    contactPerson,
  } = storeData;
  const storeUpdates: { [key: string]: any } = {};
  const addressUpdates: { [key: string]: any } = {};
  const userUpdates: { [key: string]: any } = {};

  // Manually check each field and add to updates object
  if (storeName) storeUpdates.storeName = storeName;

  if (country) addressUpdates.country = country;
  if (city) addressUpdates.city = city;
  if (streetName) addressUpdates.streetName = streetName;
  if (zipcode) addressUpdates.zipcode = zipcode;

  if (phone) userUpdates.phone = phone;
  if (contactPerson) userUpdates.name = contactPerson;

  const currentStore = await prisma.stores.findUnique({
    where: { id: storeId },
    include:{
      users: true
    }
  });
  if (!currentStore) throw new HttpException(400, "store not found");

  const checkPhone = await prisma.users.findFirst({
    where: {
      phone,
      NOT: {
        id: currentStore.users.id,
      },
    },
  });
  if (checkPhone) throw new HttpException(401, "Phone number already exists");

  if (role === "retailer") {
    if (currentStore.userId !== userId) {
      throw new HttpException(401, "Unauthorized access");
    }
  }

  if (role === "admin") {
    const checkUser = await prisma.users.findUnique({
      where: { id: userId },
      include: { manager: { include: { roles: true } } },
    });
    if (checkUser?.manager?.roles.title !== "super admin")
      throw new HttpException(401, "Unauthorized access");
  }

  const updatedStore: StoreQueryResponse = await prisma.$transaction(
    async (tx) => {
      await prisma.address.update({
        where: { id: currentStore.addressId },
        data: addressUpdates,
      });
      await prisma.users.update({
        where: { id: currentStore.userId },
        data: userUpdates,
      });

      return await prisma.stores.update({
        where: { id: storeId },
        data: storeUpdates,
        include: { address: true, users: true },
      });
    }
  );
  return storeMapper(updatedStore);
};

export const updateStoreStatus = async (
  storeId: number,
  userId: number,
  role: string
): Promise<StoreResponse> => {
  if (role === "admin") {
    const checkUser = await prisma.users.findUnique({
      where: { id: userId },
      include: { manager: { include: { roles: true } } },
    });
    if (checkUser?.manager?.roles.title !== "super admin")
      throw new HttpException(401, "Unauthorized access");
  }

  const storeToUpdate = await prisma.stores.findUnique({
    where: { id: storeId },
  });

  if (!storeToUpdate) throw new HttpException(404, "Store not found");

  const updatedStatus: StoreQueryResponse = await prisma.stores.update({
    where: { id: storeId },
    data: {
      status:
        storeToUpdate.status.toLowerCase() === "active" ? "Inactive" : "Active",
    },
    include: {
      address: true,
      users: true,
    },
  });
  return storeMapper(updatedStatus);
};
