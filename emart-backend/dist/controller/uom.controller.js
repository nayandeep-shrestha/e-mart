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
const validateToken_1 = require("../middleware/validateToken");
const rbac_1 = require("../middleware/rbac");
const uom_service_1 = require("../services/uom.service");
const router = (0, express_1.Router)();
router.get('/:productId/unit/:unitType', validateToken_1.validateToken, (0, rbac_1.allow)(['Retailer']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = Number(req.params.productId);
        const unitType = req.params.unitType;
        const response = yield (0, uom_service_1.identifyUnit)(productId, unitType);
        res.status(200).json({
            msg: "Unit price fetched",
            result: response
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
