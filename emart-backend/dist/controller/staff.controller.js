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
const rbac_1 = require("../middleware/rbac");
const staff_service_1 = require("../services/staff.service");
router.post('/', validateToken_1.validateToken, (0, rbac_1.allow)(['Wholesaler']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const staffData = yield (0, staff_service_1.createStaff)(req.body, req.userId);
        res.status(201).json({
            msg: "Staff created successfully",
            result: staffData
        });
    }
    catch (error) {
        next(error);
    }
}));
router.get('/', validateToken_1.validateToken, (0, rbac_1.allow)(['Wholesaler']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const staffsList = yield (0, staff_service_1.getStaffsByUserId)(req.userId);
        res.status(200).json({
            msg: "Staffs list fetched",
            result: staffsList
        });
    }
    catch (error) {
        next(error);
    }
}));
router.delete('/:staffId', validateToken_1.validateToken, (0, rbac_1.allow)(['Wholesaler']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let staffId = Number(req.params.staffId);
        const userId = req.userId;
        const deletedStaffData = yield (0, staff_service_1.deleteStaffById)(staffId, userId);
        res.status(201).json({
            msg: "staff deleted",
            result: deletedStaffData
        });
    }
    catch (error) {
        next(error);
    }
}));
router.patch('/:staffId', validateToken_1.validateToken, (0, rbac_1.allow)(['Wholesaler']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedStaffData = yield (0, staff_service_1.updateStaffById)(Number(req.params.staffId), req.body, req.userId);
        res.status(201).json({
            msg: "Staff data updated successfully",
            result: updatedStaffData
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
