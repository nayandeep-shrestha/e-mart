"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = (id) => {
    return jsonwebtoken_1.default.sign({ id: id }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '20m' });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (id) => {
    return jsonwebtoken_1.default.sign({ id: id }, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
};
exports.generateRefreshToken = generateRefreshToken;
