"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userListMapper = exports.userLoginMapper = exports.userMapper = void 0;
const generateToken_utils_1 = require("../utils/generateToken.utils");
const userMapper = (user) => ({
    role: user.roles.title,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    wholesalerId: user.wholesalerId
});
exports.userMapper = userMapper;
const userLoginMapper = (user) => ({
    role: user.roles.title,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    accessToken: (0, generateToken_utils_1.generateAccessToken)(user.id),
    refreshToken: (0, generateToken_utils_1.generateRefreshToken)(user.id)
});
exports.userLoginMapper = userLoginMapper;
const userListMapper = (userList) => (userList.map(user => ({
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.roles.title,
    address: user.address
})));
exports.userListMapper = userListMapper;
