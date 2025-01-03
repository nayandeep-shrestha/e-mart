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
exports.profile = exports.login = exports.createUser = void 0;
const validation_utils_1 = require("../utils/validation.utils");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_mapper_1 = require("../mappers/user.mapper");
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const createUser = (input) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof input === "undefined") {
        throw new http_exception_model_1.default(400, "Data is not defined");
    }
    const { roleId, name, email, password, phone, country, city, streetName, zipcode, wholesalerId, } = input;
    if (!roleId)
        throw new http_exception_model_1.default(422, "Role id can't be blank");
    if (!name)
        throw new http_exception_model_1.default(422, "Name can't be blank");
    if (!email)
        throw new http_exception_model_1.default(422, "Email can't be blank");
    else if (!(0, validation_utils_1.emailValidation)(email))
        throw new http_exception_model_1.default(400, "Invalid Email");
    if (!password)
        throw new http_exception_model_1.default(422, "Password can't be blank");
    else if (!(0, validation_utils_1.passwordValidation)(password))
        throw new http_exception_model_1.default(400, "Password invalid");
    if (!phone)
        throw new http_exception_model_1.default(422, "Phone number can't be blank");
    else if (!phone.match(/^(\+977)?[9][6-9]\d{8}$/)) {
        throw new http_exception_model_1.default(400, "Please enter valid mobile number");
    }
    if (!country)
        throw new http_exception_model_1.default(422, "Country can't be blank");
    if (!city)
        throw new http_exception_model_1.default(422, "City can't be blank");
    if (!streetName)
        throw new http_exception_model_1.default(422, "Street name can't be blank");
    const role = yield prisma.roles.findUnique({
        where: {
            id: roleId,
        },
        select: { title: true },
    });
    if (!role)
        throw new http_exception_model_1.default(400, "Invalid role");
    const existingUser = yield prisma.users.findMany({
        where: {
            OR: [
                { email: email },
                { phone: phone },
            ],
        },
    });
    if (existingUser.length > 0) {
        const conflictField = existingUser[0].email === email ? 'email' : 'phone';
        throw new http_exception_model_1.default(409, `${conflictField} already exists`);
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    if (role.title !== "Retailer") {
        if (wholesalerId)
            throw new http_exception_model_1.default(400, "Wholesaler id is not required");
        let userData = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const addressData = yield tx.address.create({
                data: {
                    country: country,
                    city: city,
                    streetName,
                    zipcode: Number(zipcode),
                },
            });
            return yield tx.users.create({
                data: {
                    roleId,
                    name,
                    email,
                    password: hashedPassword,
                    phone,
                    addressId: addressData.id,
                },
                include: {
                    address: true,
                    roles: true,
                },
            });
        }));
        return (0, user_mapper_1.userMapper)(userData);
    }
    if (!wholesalerId || typeof wholesalerId === undefined)
        throw new http_exception_model_1.default(422, "Wholesaler Id can't be blank");
    const checkWholesaler = yield prisma.users.findUnique({
        where: {
            id: wholesalerId
        }, include: {
            roles: true
        }
    });
    if (!checkWholesaler)
        throw new http_exception_model_1.default(404, "Wholesaler not found");
    if (checkWholesaler.roles.title !== 'Wholesaler')
        throw new http_exception_model_1.default(400, "Invalid wholesaeler id");
    let userData = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const addressData = yield tx.address.create({
            data: {
                country: country,
                city: city,
                streetName,
                zipcode: Number(zipcode),
            },
        });
        let createdUserData = yield tx.users.create({
            data: {
                roleId,
                name,
                email,
                password: hashedPassword,
                phone,
                addressId: addressData.id,
            },
            include: {
                address: true,
                roles: true,
            },
        });
        yield tx.wholesaleRelationship.create({
            data: {
                wholesalerId: wholesalerId,
                retailerId: createdUserData.id,
            },
        });
        createdUserData.wholesalerId = wholesalerId;
        return createdUserData;
    }));
    return (0, user_mapper_1.userMapper)(userData);
});
exports.createUser = createUser;
const login = (userPayload) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof userPayload === "undefined") {
        throw new http_exception_model_1.default(400, "Data is not defined");
    }
    const { email, password } = userPayload;
    if (!email)
        throw new http_exception_model_1.default(422, "Email can't be blank");
    else if (!(0, validation_utils_1.emailValidation)(email))
        throw new http_exception_model_1.default(400, "Invalid Email");
    if (!password)
        throw new http_exception_model_1.default(422, "Password can't be blank");
    else if (!(0, validation_utils_1.passwordValidation)(password))
        throw new http_exception_model_1.default(400, "Password invalid");
    const validUser = yield prisma.users.findUnique({
        where: {
            email: email,
        },
        include: {
            address: true,
            roles: true,
        },
    });
    if (!validUser) {
        throw new http_exception_model_1.default(404, "user not found");
    }
    if (bcrypt_1.default.compareSync(password, validUser.password)) {
        // const { id, name, email, address, phone, roles } = validUser
        return (0, user_mapper_1.userLoginMapper)(validUser);
    }
    else {
        throw new http_exception_model_1.default(401, "Credentials doesn't match");
    }
});
exports.login = login;
const profile = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const profileData = yield prisma.users.findUnique({
        where: {
            id,
        },
        include: {
            roles: true,
            address: true,
        },
    });
    if (!profileData) {
        throw new http_exception_model_1.default(404, "User not found");
    }
    return (0, user_mapper_1.userMapper)(profileData);
});
exports.profile = profile;
