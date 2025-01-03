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
const validateToken_1 = require("../middleware/validateToken");
const rbac_1 = require("../middleware/rbac");
const auth_service_1 = require("../services/auth.service");
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const user_service_1 = require("../services/user.service");
router.post('/', validateToken_1.validateToken, (0, rbac_1.allow)(["Admin"]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userData = req.body;
        const user = yield (0, auth_service_1.createUser)(userData);
        res.status(201).json({
            msg: "User created successfully",
            result: user
        });
    }
    catch (error) {
        next(error);
    }
}));
router.get('/', validateToken_1.validateToken, (0, rbac_1.allow)(["Admin", "Wholesaler"]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = req.userId;
        if (typeof id === 'undefined')
            throw new http_exception_model_1.default(400, "Id is not defined");
        let role = req.role;
        if (typeof role === 'undefined')
            throw new http_exception_model_1.default(400, "Role is not defined");
        const usersList = yield (0, user_service_1.getAllUsers)(id, role);
        res.status(200).json({
            msg: "Users list fetched",
            result: usersList
        });
    }
    catch (error) {
        next(error);
    }
}));
router.patch('/:userId', validateToken_1.validateToken, (0, rbac_1.allow)(["Admin"]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = Number(req.params.userId);
        if (typeof userId === null || typeof userId === undefined)
            throw "User id not provided";
        const updatedUserData = yield (0, user_service_1.updateUserById)(userId, req.body);
        res.status(201).json({
            msg: "User updated successfully",
            result: updatedUserData
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
