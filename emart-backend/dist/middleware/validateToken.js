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
exports.validateToken = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
exports.prisma = new client_1.PrismaClient();
const JWT = require('jsonwebtoken');
const validateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.headers['authorization'];
        if (!token) {
            throw new http_exception_model_1.default(401, "Authorization header is empty");
        }
        let tokenParts = token.split(" ");
        token = tokenParts.pop();
        if (!token) {
            throw new http_exception_model_1.default(401, 'Unauthorized');
        }
        // const tokenData:JwtPayload | string = JWT.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET)
        const tokenData = JWT.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
        if (!tokenData) {
            throw new http_exception_model_1.default(403, 'Invalid token');
        }
        let user = yield exports.prisma.users.findUnique({
            where: {
                id: tokenData.id
            }, include: {
                roles: true
            }
        });
        if (!user)
            throw new http_exception_model_1.default(400, "user not found");
        req.userId = tokenData.id;
        req.role = user.roles.title;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.validateToken = validateToken;
// module.exports = validateToken
