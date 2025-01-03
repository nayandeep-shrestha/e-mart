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
exports.identifyUnit = void 0;
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const identifyUnit = (productId, unitType) => __awaiter(void 0, void 0, void 0, function* () {
    const validType = ['piece', 'bora', 'kg', 'carton'];
    if (!productId)
        throw new http_exception_model_1.default(400, "Product id is not defined");
    if (!unitType)
        throw new http_exception_model_1.default(400, "Unit type is not defined");
    if (!validType.includes(unitType.toLowerCase()))
        throw new http_exception_model_1.default(400, "Invalid unit type");
    const checkProduct = yield prisma.products.findUnique({
        where: {
            id: productId
        }
    });
    if (!checkProduct)
        throw new http_exception_model_1.default(404, "Product not found");
    const selectedFields = {
        id: true,
        [unitType.toLowerCase()]: true,
    };
    const result = yield prisma.uOM.findUnique({
        where: { productId },
        select: selectedFields,
    });
    if (!result)
        throw new http_exception_model_1.default(404, 'Product not found');
    return result;
});
exports.identifyUnit = identifyUnit;
