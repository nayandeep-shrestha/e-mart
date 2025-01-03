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
exports.updateUserById = exports.deleteUserById = exports.getAllUsers = void 0;
const client_1 = require("@prisma/client");
const user_mapper_1 = require("../mappers/user.mapper");
const validation_utils_1 = require("../utils/validation.utils");
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const prisma = new client_1.PrismaClient();
const getAllUsers = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    if (role === 'Admin') {
        let usersList = yield prisma.users.findMany({
            where: {
                id: {
                    not: userId
                }
            }, include: {
                address: true,
                roles: true
            }
        });
        if (!usersList)
            throw "Users not found";
        return (0, user_mapper_1.userListMapper)(usersList);
    }
    let wholesaleRetailerRelation = yield prisma.wholesaleRelationship.findMany({
        where: {
            wholesalerId: userId
        }, select: {
            retailerId: true
        }
    });
    const retailerIdList = wholesaleRetailerRelation.map(item => item.retailerId);
    const userList = yield prisma.users.findMany({
        where: {
            id: {
                in: retailerIdList
            }
        }, include: {
            address: true,
            roles: true
        }
    });
    return (0, user_mapper_1.userListMapper)(userList);
});
exports.getAllUsers = getAllUsers;
const deleteUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma.users.findUnique({
        where: {
            id: userId
        }
    });
    if (!userData)
        throw "User not found";
    const deletedData = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const deletedUser = yield tx.users.delete({
            where: {
                id: userId
            }, include: {
                roles: true,
                address: true
            }
        });
        yield tx.address.delete({
            where: {
                id: deletedUser.addressId
            }
        });
        return deletedUser;
    }));
    return (0, user_mapper_1.userMapper)(deletedData);
});
exports.deleteUserById = deleteUserById;
const updateUserById = (userId, updatedUserData) => __awaiter(void 0, void 0, void 0, function* () {
    let currentUserData = yield prisma.users.findUnique({
        where: {
            id: userId
        }, include: {
            address: true
        }
    });
    if (!currentUserData)
        throw "user not found";
    if (typeof updatedUserData === 'undefined') {
        throw "Data is not defined";
    }
    const { roleId, name, email, phone, country, city, zipcode, streetName } = updatedUserData;
    if (!roleId)
        throw new http_exception_model_1.default(422, "Role id can't be blank");
    if (!name)
        throw new http_exception_model_1.default(422, "Name can't be blank");
    if (!email)
        throw new http_exception_model_1.default(422, "Email can't be blank");
    else if (!(0, validation_utils_1.emailValidation)(email))
        throw new http_exception_model_1.default(400, "Invalid Email");
    if (!phone)
        throw new http_exception_model_1.default(422, "Phone number can't be blank");
    else if (!(phone.match(/^(\+977)?[9][6-9]\d{8}$/))) {
        throw new http_exception_model_1.default(400, "Please enter valid mobile number");
    }
    if (!country)
        throw new http_exception_model_1.default(422, "Country can't be blank");
    if (!city)
        throw new http_exception_model_1.default(422, "City can't be blank");
    if (!streetName)
        throw new http_exception_model_1.default(422, "Street name can't be blank");
    const existingEmailUser = yield prisma.users.findFirst({
        where: {
            email: updatedUserData.email,
            NOT: {
                id: currentUserData.id
            }
        },
    });
    const existingPhoneUser = yield prisma.users.findFirst({
        where: {
            phone: updatedUserData.phone,
            NOT: {
                id: currentUserData.id
            }
        },
    });
    let errorMessage = "";
    if (existingEmailUser) {
        errorMessage += "Email already exists. ";
    }
    if (existingPhoneUser) {
        errorMessage += "Phone number already exists.";
    }
    if (errorMessage)
        throw new http_exception_model_1.default(400, errorMessage.trim());
    const updatedData = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const addressData = yield tx.address.update({
            where: {
                id: currentUserData.addressId
            },
            data: {
                country: updatedUserData.country,
                city: updatedUserData.city,
                streetName: updatedUserData.streetName,
                zipcode: typeof updatedUserData.zipcode !== null ? updatedUserData.zipcode : currentUserData.address.zipcode
            }
        });
        return yield tx.users.update({
            where: {
                id: currentUserData.id
            },
            data: {
                roleId: updatedUserData.roleId,
                name: updatedUserData.name,
                email: updatedUserData.email,
                password: currentUserData.password,
                phone: updatedUserData.phone,
                addressId: addressData.id,
            }, include: {
                address: true,
                roles: true
            }
        });
    }));
    return (0, user_mapper_1.userMapper)(updatedData);
});
exports.updateUserById = updateUserById;
