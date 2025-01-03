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
exports.storeLisMapper = exports.storeMapper = void 0;
const storeMapper = (store) => __awaiter(void 0, void 0, void 0, function* () {
    return ({
        id: store.id,
        storeName: store.storeName,
        pan: store.storeName,
        userId: store.userId,
        address: store.address,
        email: store.email,
        phone: store.phone,
        status: store.status,
    });
});
exports.storeMapper = storeMapper;
const storeLisMapper = (storeList) => storeList.map((store) => ({
    id: store.id,
    userId: store.userId,
    storeName: store.storeName,
    pan: store.pan,
    address: store.address,
    email: store.email,
    phone: store.phone,
    status: store.status,
}));
exports.storeLisMapper = storeLisMapper;
