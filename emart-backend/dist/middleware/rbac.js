"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrict = exports.allow = void 0;
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const allow = (roles) => {
    return (req, res, next) => {
        let role = req.role;
        if (roles.includes(role)) {
            next();
        }
        else {
            next(new http_exception_model_1.default(401, "Unauthorized"));
        }
    };
};
exports.allow = allow;
const restrict = (roles) => {
    return (req, res, next) => {
        let role = req.role;
        if (roles.includes(role)) {
            next(new http_exception_model_1.default(401, "Unauthorized"));
        }
        else {
            next();
        }
    };
};
exports.restrict = restrict;
