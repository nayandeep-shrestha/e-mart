"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStaffById = exports.deleteStaffById = exports.getStaffsByUserId = exports.createStaff = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const staff_mapper_1 = require("../mappers/staff.mapper");
const createStaff = (staffData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId)
        throw new http_exception_model_1.default(401, "User not valid");
    if (typeof staffData === 'undefined')
        throw new http_exception_model_1.default(400, "Data is not defined");
    const { storeId, name, phone, country, city, zipcode, streetName } = staffData;
    if (!storeId)
        throw new http_exception_model_1.default(422, "Store id can't be blank");
    if (!name)
        throw new http_exception_model_1.default(422, "Name can't be blank");
    if (!phone)
        throw new http_exception_model_1.default(422, "Phone number can't be blank");
    else if (!(phone.match(/^(\+977)?[9][6-9]\d{8}$/))) {
        throw new http_exception_model_1.default(400, "Invalid mobile number");
    }
    if (!country)
        throw new http_exception_model_1.default(422, "Country can't be blank");
    if (!city)
        throw new http_exception_model_1.default(422, "City can't be blank");
    if (!streetName)
        throw new http_exception_model_1.default(422, "Street name can't be blank");
    const checkStore = yield prisma.stores.findUnique({
        where: {
            id: storeId,
            userId
        }
    });
    if (!checkStore)
        throw new http_exception_model_1.default(404, 'Store not found');
    const existingUser = yield prisma.users.findUnique({
        where: {
            phone
        },
    });
    if (existingUser)
        throw new http_exception_model_1.default(400, "Phone already exists");
    const createdStaffData = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const addressData = yield tx.address.create({
            data: {
                country: country,
                city: city,
                streetName,
                zipcode: Number(zipcode)
            }
        });
        return yield tx.staffs.create({
            data: {
                storeId,
                name,
                phone,
                addressId: addressData.id,
            }, include: {
                address: true
            }
        });
    }));
    return (0, staff_mapper_1.staffMapper)(createdStaffData);
});
exports.createStaff = createStaff;
const getStaffsByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof userId === null || typeof userId === undefined)
        throw new http_exception_model_1.default(400, "Id not provided");
    const userData = yield prisma.users.findUnique({
        where: {
            id: userId
        }
    });
    if (!userData)
        throw new http_exception_model_1.default(404, 'User not found');
    const storesList = yield prisma.stores.findMany({
        where: {
            userId
        }, select: {
            id: true
        }
    });
    if (!storesList)
        throw new http_exception_model_1.default(404, 'Store not found');
    const storeIds = storesList.map(obj => obj.id);
    const staffsList = yield prisma.staffs.findMany({
        where: {
            storeId: {
                in: storeIds
            }
        }, include: {
            address: true
        }
    });
    return (0, staff_mapper_1.staffProfileMapper)(staffsList);
});
exports.getStaffsByUserId = getStaffsByUserId;
const deleteStaffById = (staffId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof staffId === null || typeof staffId === undefined)
        throw "Staff id not provided";
    if (typeof userId === null || typeof userId === undefined)
        throw "User id not defined";
    const checkStaffUserLink = yield prisma.staffs.findFirst({
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
    if (!checkStaffUserLink)
        throw new http_exception_model_1.default(401, "User not authorized");
    const deletedStaffData = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const deletedStaff = yield tx.staffs.delete({
            where: {
                id: staffId
            }, include: {
                address: true
            }
        });
        yield tx.address.delete({
            where: {
                id: deletedStaff.addressId
            }
        });
        return deletedStaff;
    }));
    return (0, staff_mapper_1.staffMapper)(deletedStaffData);
});
exports.deleteStaffById = deleteStaffById;
const updateStaffById = (staffId, updatedStaffData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof staffId === null || typeof staffId === undefined)
        throw "Staff id not provided";
    if (typeof userId === null || typeof userId === undefined)
        throw "User id not defined";
    const checkStaffUserLink = yield prisma.staffs.findFirst({
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
    if (!checkStaffUserLink)
        throw new http_exception_model_1.default(401, "User not authorized");
    if (typeof updatedStaffData === 'undefined') {
        throw new http_exception_model_1.default(400, "Data is not defined");
    }
    const { storeId, name, phone, country, city, zipcode, streetName } = updatedStaffData;
    if (!storeId)
        throw new http_exception_model_1.default(422, "Store id can't be blank");
    const checkStore = yield prisma.stores.findUnique({
        where: {
            id: storeId,
            userId
        }
    });
    if (!checkStore)
        throw new http_exception_model_1.default(400, "Invalid store id");
    if (!name)
        throw new http_exception_model_1.default(422, "Name is required");
    if (!phone)
        throw new http_exception_model_1.default(422, "Phone number is required");
    else if (!(phone.match(/^(\+977)?[9][6-9]\d{8}$/))) {
        throw new http_exception_model_1.default(400, "Please enter valid mobile number");
    }
    if (!country)
        throw new http_exception_model_1.default(422, "Country is required");
    if (!city)
        throw new http_exception_model_1.default(422, "City is required");
    if (!streetName)
        throw new http_exception_model_1.default(422, "Street name is required");
    const currentStaffData = yield prisma.staffs.findUnique({
        where: {
            id: staffId
        }, include: {
            address: true
        }
    });
    if (!currentStaffData)
        throw new http_exception_model_1.default(404, "Staff not found");
    const existingUser = yield prisma.staffs.findUnique({
        where: {
            phone: phone,
            NOT: {
                id: Number(staffId)
            }
        }
    });
    if (existingUser)
        throw new http_exception_model_1.default(400, "Phone number already exist");
    const updatedData = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const addressData = yield tx.address.update({
            where: {
                id: currentStaffData.addressId
            },
            data: {
                country: country,
                city: city,
                streetName,
                zipcode: typeof zipcode !== null ? zipcode : currentStaffData.address.zipcode
            }
        });
        return yield tx.staffs.update({
            where: {
                id: Number(staffId)
            },
            data: {
                storeId,
                name,
                phone,
                addressId: addressData.id,
            }, include: {
                address: true
            }
        });
    }));
    return (0, staff_mapper_1.staffMapper)(updatedData);
});
exports.updateStaffById = updateStaffById;
