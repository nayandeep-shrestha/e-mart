import { PrismaClient , Prisma } from '@prisma/client'
const prisma = new PrismaClient()
import HttpException from "../models/http-exception.model";
import { StaffCreatePayload, StaffQueryResponse, StaffResponse } from '../models/staff.model';
import { staffMapper, staffProfileMapper } from '../mappers/staff.mapper';

export const createStaff = async (staffData: StaffCreatePayload, userId: number): Promise<StaffResponse> => {

    if(!userId) throw new HttpException(401, "User not valid")
    if (typeof staffData === 'undefined') throw new HttpException(400, "Data is not defined")

    const { storeId, name, phone, country, city, zipcode, streetName } = staffData;

    if (!storeId) throw new HttpException(422, "Store id can't be blank");

    if (!name) throw new HttpException(422, "Name can't be blank");

    if (!phone) throw new HttpException(422, "Phone number can't be blank");
    else if (!(phone.match(/^(\+977)?[9][6-9]\d{8}$/))) {
        throw new HttpException(400, "Invalid mobile number");
    }

    if (!country) throw new HttpException(422, "Country can't be blank");
    if (!city) throw new HttpException(422, "City can't be blank");
    if (!streetName) throw new HttpException(422, "Street name can't be blank");

    const checkStore = await prisma.stores.findUnique({
        where:{
            id: storeId,
            userId    
        }
    })
    if(!checkStore) throw new HttpException(404, 'Store not found')

    const existingUser = await prisma.users.findUnique({
        where: {
            phone
        },
    });

    if (existingUser) throw new HttpException(400, "Phone already exists")

    const createdStaffData: StaffQueryResponse = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const addressData = await tx.address.create({
            data: {
                country: country,
                city: city,
                streetName,
                zipcode: Number(zipcode)
            }
        })

        return await tx.staffs.create({
            data: {
                storeId,
                name,
                phone,
                addressId: addressData.id,
            }, include: {
                address: true
            }
        })
    })
    return staffMapper(createdStaffData)
}

export const getStaffsByUserId = async (userId: number) : Promise<StaffResponse[]>=> {
    if (typeof userId === null || typeof userId === undefined) throw new HttpException(400, "Id not provided")

    const userData = await prisma.users.findUnique({
        where: {
            id: userId
        }
    })
    if (!userData) throw new HttpException(404, 'User not found')

    const storesList = await prisma.stores.findMany({
        where: {
            userId
        }, select: {
            id: true
        }
    })

    if (!storesList) throw new HttpException(404, 'Store not found')

    const storeIds = storesList.map(obj => obj.id);
    const staffsList : StaffQueryResponse[] = await prisma.staffs.findMany({
        where: {
            storeId: {
                in: storeIds
            }
        },include: {
            address: true
        }
    })
    
    return staffProfileMapper(staffsList)
}

export const deleteStaffById = async (staffId: number, userId: number): Promise<StaffResponse> => {

    if (typeof staffId === null || typeof staffId === undefined) throw "Staff id not provided"
    if (typeof userId === null || typeof userId === undefined) throw "User id not defined"

    const checkStaffUserLink = await prisma.staffs.findFirst({
        where: {
          id: staffId,
          stores: {
            userId: userId
          }
        },
        include: {
          stores: true
        }
      });
    
    if(!checkStaffUserLink) throw new HttpException(401, "User not authorized")

    const deletedStaffData: StaffQueryResponse = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const deletedStaff = await tx.staffs.delete({
            where: {
                id: staffId
            },include:{
                address: true
            }
        })
        await tx.address.delete({
            where: {
                id: deletedStaff.addressId
            }
        })
        return deletedStaff
    })

    return staffMapper(deletedStaffData)
}

export const updateStaffById = async (staffId:number, updatedStaffData: StaffCreatePayload, userId: number): Promise<StaffResponse> =>{

    if (typeof staffId === null || typeof staffId === undefined) throw "Staff id not provided"
    if (typeof userId === null || typeof userId === undefined) throw "User id not defined"

    const checkStaffUserLink = await prisma.staffs.findFirst({
        where: {
          id: staffId,
          stores: {
            userId: userId
          }
        },
        include: {
          stores: true
        }
      });
    if(!checkStaffUserLink) throw new HttpException(401, "User not authorized")

    if (typeof updatedStaffData === 'undefined') {
        throw new HttpException(400,"Data is not defined")
    }

    const { storeId, name, phone, country, city, zipcode, streetName } = updatedStaffData;

    if (!storeId) throw new HttpException(422,"Store id can't be blank")
    const checkStore = await prisma.stores.findUnique({
        where:{
            id: storeId,
            userId
        }
    })
    if(!checkStore) throw new HttpException(400, "Invalid store id")

    if (!name) throw new HttpException(422,"Name is required")

    if (!phone) throw new HttpException(422,"Phone number is required")
    else if (!(phone.match(/^(\+977)?[9][6-9]\d{8}$/))) {
        throw new HttpException(400,"Please enter valid mobile number")
    }

    if (!country) throw new HttpException(422,"Country is required")
    if (!city) throw new HttpException(422,"City is required")
    if (!streetName) throw new HttpException(422,"Street name is required")

    const currentStaffData = await prisma.staffs.findUnique({
        where:{
            id: staffId
        },include:{
            address: true
        }
    })
    if(!currentStaffData) throw new HttpException(404,"Staff not found")

    const existingUser = await prisma.staffs.findUnique({
        where: {
            phone: phone,
            NOT: {
                id: Number(staffId) 
            }
        }
    });
    
    if(existingUser) throw new HttpException(400,"Phone number already exist")
    const updatedData:StaffQueryResponse = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const addressData = await tx.address.update({
            where:{
                id: currentStaffData.addressId
            },
            data: {
                country: country,
                city: city,
                streetName,
                zipcode:typeof zipcode !== null ?  zipcode: currentStaffData.address.zipcode 
            }
        })

        return await tx.staffs.update({
            where:{
                id: Number(staffId)
            },
            data: {
                storeId,
                name,
                phone,
                addressId: addressData.id,
            },include:{
                address: true
            }
        })
    })

    return staffMapper(updatedData)
}
