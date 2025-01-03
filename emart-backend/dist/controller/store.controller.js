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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const validateToken_1 = require("../middleware/validateToken");
const store_service_1 = require("../services/store.service");
const rbac_1 = require("../middleware/rbac");
router.post('/', validateToken_1.validateToken, (0, rbac_1.allow)(['Wholesaler', 'Admin']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeData = yield (0, store_service_1.createStore)(req.body, req.userId, req.role);
        res.status(201).json({
            msg: "Store created",
            result: storeData
        });
    }
    catch (error) {
        next(error);
    }
}));
router.get('/', validateToken_1.validateToken, (0, rbac_1.allow)(['Wholesaler', 'Admin']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = Number(req.userId);
        if (typeof userId === null || typeof userId === undefined)
            throw "User id not provided";
        const storesList = yield (0, store_service_1.getStoresByUserId)(userId);
        res.json({
            msg: "Stores list fetched",
            result: storesList
        });
    }
    catch (error) {
        next(error);
    }
}));
router.delete('/:storeId', validateToken_1.validateToken, (0, rbac_1.allow)(['Wholesaler', 'Admin']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let storeId = Number(req.params.storeId);
        if (typeof storeId === null || typeof storeId === undefined)
            throw "User id not provided";
        const deletedStore = yield (0, store_service_1.deleteStoreById)(storeId, req.userId);
        res.status(201).json({
            msg: "Store deleted",
            result: deletedStore
        });
    }
    catch (error) {
        next(error);
    }
}));
router.patch('/:storeId', validateToken_1.validateToken, (0, rbac_1.allow)(['Wholesaler', 'Admin']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let storeId = Number(req.params.storeId);
        if (typeof storeId === null || typeof storeId === undefined)
            throw "User id not provided";
        const updatedStoreData = yield (0, store_service_1.updateStoreById)(storeId, req.body, req.userId, req.role);
        res.status(201).json({
            msg: "Store Data updated",
            result: updatedStoreData
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
