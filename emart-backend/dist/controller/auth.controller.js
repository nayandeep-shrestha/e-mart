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
const express_1 = require("express");
const router = (0, express_1.Router)();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_service_1 = require("../services/auth.service");
const validateToken_1 = require("../middleware/validateToken");
const generateToken_utils_1 = require("../utils/generateToken.utils");
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
router.post('/signup', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userData = req.body;
        const user = yield (0, auth_service_1.createUser)(userData);
        res.status(201).json({
            msg: "Account created successfully",
            result: user
        });
    }
    catch (error) {
        next(error);
    }
}));
router.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = req.body;
        const loginResponse = yield (0, auth_service_1.login)(data);
        res.status(200).json({
            msg: "Logged in successfully",
            result: loginResponse
        });
    }
    catch (error) {
        next(error);
    }
}));
router.get('/profile', validateToken_1.validateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profileData = yield (0, auth_service_1.profile)(req.userId);
        res.status(200).json({
            msg: "Profile fetched",
            result: profileData
        });
    }
    catch (error) {
        next(error);
    }
}));
router.get('/refetch', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let refreshToken = req.headers['authorization'];
        if (!refreshToken) {
            throw new http_exception_model_1.default(400, "Authorization header is empty");
        }
        let tokenParts = refreshToken.split(" ");
        refreshToken = tokenParts.pop();
        if (!refreshToken) {
            throw new http_exception_model_1.default(403, 'Unauthorized access');
        }
        const tokenVerify = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
        if (typeof tokenVerify === 'string') {
            throw new http_exception_model_1.default(400, "Unexpected token");
        }
        let newAccessToken = (0, generateToken_utils_1.generateAccessToken)(tokenVerify.id);
        res.status(200).json({
            msg: "New token fetched",
            result: {
                accessToken: newAccessToken
            }
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
