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
exports.updateStoreById = exports.deleteStoreById = exports.getStoresByUserId = exports.createStore = void 0;
const client_1 = require("@prisma/client");
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const store_mapper_1 = require("../mappers/store.mapper");
const validation_utils_1 = require("../utils/validation.utils");
const prisma = new client_1.PrismaClient();
const createStore = (storeData, userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof storeData === "undefined")
        throw new http_exception_model_1.default(400, "Data is not defined");
    if (!storeData.storeName)
        throw new http_exception_model_1.default(400, "Empty store name");
    if (!storeData.pan)
        throw new http_exception_model_1.default(400, "Empty pan value");
    if (!storeData.country)
        throw new http_exception_model_1.default(400, "Country is required");
    if (!storeData.city)
        throw new http_exception_model_1.default(400, "City is required");
    if (!storeData.streetName)
        throw new http_exception_model_1.default(400, "Street name is required");
    if (!storeData.email)
        throw new http_exception_model_1.default(422, "Email can't be blank");
    else if (!(0, validation_utils_1.emailValidation)(storeData.email))
        throw new http_exception_model_1.default(400, "Invalid Email");
    if (!storeData.phone)
        throw new http_exception_model_1.default(422, "Phone number can't be blank");
    else if (!(storeData.phone.match(/^(\+977)?[9][6-9]\d{8}$/))) {
        throw new http_exception_model_1.default(400, "Please enter valid mobile number");
    }
    const existingStore = yield prisma.stores.findMany({
        where: {
            OR: [
                { email: storeData.email },
                { phone: storeData.phone },
                { pan: storeData.pan },
            ],
        },
    });
    if (existingStore.length > 0) {
        let conflictField = '';
        if (existingStore.some(store => store.pan === storeData.pan)) {
            conflictField = 'Pan';
        }
        else if (existingStore.some(store => store.email === storeData.email)) {
            conflictField = 'Email';
        }
        else if (existingStore.some(store => store.phone === storeData.phone)) {
            conflictField = 'Phone';
        }
        throw new http_exception_model_1.default(400, `${conflictField} already exists`);
    }
    if (role === "Admin" && !storeData.userId)
        throw new http_exception_model_1.default(400, "Wholeseller id not provided");
    if (role !== "Admin" && storeData.userId)
        storeData.userId = userId;
    storeData.userId = userId;
    const createdStoreData = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const addressData = yield tx.address.create({
            data: {
                country: storeData.country,
                city: storeData.city,
                streetName: storeData.streetName,
                zipcode: Number(storeData.zipcode),
            },
        });
        return yield tx.stores.create({
            data: {
                storeName: storeData.storeName,
                pan: storeData.pan,
                userId: storeData.userId,
                addressId: addressData.id,
                email: storeData.email,
                phone: storeData.phone,
                status: typeof storeData.status === null ? 'Active' : storeData.status
            },
            include: {
                address: true,
            },
        });
    }));
    return (0, store_mapper_1.storeMapper)(createdStoreData);
});
exports.createStore = createStore;
const getStoresByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma.users.findUnique({
        where: {
            id: userId,
        },
    });
    if (!userData)
        throw new http_exception_model_1.default(404, "User not found");
    const storesList = yield prisma.stores.findMany({
        where: {
            userId,
        },
        include: {
            address: true,
        },
    });
    if (storesList.length === 0)
        throw new http_exception_model_1.default(404, "No stores found");
    return (0, store_mapper_1.storeLisMapper)(storesList);
});
exports.getStoresByUserId = getStoresByUserId;
const deleteStoreById = (storeId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const storeData = yield prisma.stores.findUnique({
        where: {
            id: storeId,
            userId: userId
        },
    });
    if (!storeData)
        throw new http_exception_model_1.default(404, "Store not found");
    const deletedData = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.staffs.deleteMany({
            where: {
                storeId: storeId,
            },
        });
        const deletedStore = yield tx.stores.delete({
            where: {
                id: storeId,
            },
            include: {
                address: true,
            },
        });
        yield tx.address.delete({
            where: {
                id: deletedStore.addressId,
            },
        });
        return deletedStore;
    }));
    return (0, store_mapper_1.storeMapper)(deletedData);
});
exports.deleteStoreById = deleteStoreById;
const updateStoreById = (storeId, updatedStoreData, userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    let currentStoreData = yield prisma.stores.findUnique({
        where: {
            id: storeId,
            userId: role === 'admin' ? updatedStoreData.userId : userId
        },
        include: {
            address: true,
        },
    });
    if (!currentStoreData)
        throw new http_exception_model_1.default(404, "store not found");
    if (role === "Admin" && !updatedStoreData.userId)
        throw new http_exception_model_1.default(400, "Wholeseller id not provided");
    if (role !== "Admin" && updatedStoreData.userId)
        updatedStoreData.userId = userId;
    updatedStoreData.userId = userId;
    if (typeof updatedStoreData === undefined || typeof updatedStoreData === null)
        throw new http_exception_model_1.default(400, "Data is not defined");
    if (!updatedStoreData.storeName)
        throw "Empty store name";
    if (!updatedStoreData.country)
        throw "Country is required";
    if (!updatedStoreData.city)
        throw "City is required";
    if (!updatedStoreData.streetName)
        throw "Street name is required";
    if (!updatedStoreData.userId)
        throw "User id is required";
    if (!updatedStoreData.email)
        throw new http_exception_model_1.default(422, "Email can't be blank");
    else if (!(0, validation_utils_1.emailValidation)(updatedStoreData.email))
        throw new http_exception_model_1.default(400, "Invalid Email");
    if (!updatedStoreData.phone)
        throw new http_exception_model_1.default(422, "Phone number can't be blank");
    else if (!(updatedStoreData.phone.match(/^(\+977)?[9][6-9]\d{8}$/))) {
        throw new http_exception_model_1.default(400, "Please enter valid mobile number");
    }
    const existingStore = yield prisma.stores.findMany({
        where: {
            OR: [
                { email: updatedStoreData.email },
                { phone: updatedStoreData.phone },
            ],
            NOT: {
                id: storeId
            }
        },
    });
    if (existingStore.length > 0) {
        const conflictField = existingStore[0].email === updatedStoreData.email ? 'email' : 'phone';
        throw new http_exception_model_1.default(409, `${conflictField} already exists`);
    }
    updatedStoreData.pan = currentStoreData.pan;
    const responseUpdatedData = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const addressData = yield tx.address.update({
            where: {
                id: currentStoreData.addressId,
            },
            data: {
                country: updatedStoreData.country,
                city: updatedStoreData.city,
                streetName: updatedStoreData.streetName,
                zipcode: Number(updatedStoreData.zipcode),
            },
        });
        return yield tx.stores.update({
            where: {
                id: currentStoreData.id,
            },
            data: {
                storeName: updatedStoreData.storeName,
                pan: updatedStoreData.pan,
                userId: updatedStoreData.userId,
                addressId: addressData.id,
                phone: updatedStoreData.email,
                email: updatedStoreData.phone,
                status: typeof updatedStoreData.status === null ? "Active" : updatedStoreData.status
            },
            include: {
                address: true,
            },
        });
    }));
    return (0, store_mapper_1.storeMapper)(responseUpdatedData);
});
exports.updateStoreById = updateStoreById;
