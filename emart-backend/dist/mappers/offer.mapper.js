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
exports.offerListMapper = exports.offerMapper = void 0;
const offerMapper = (offer) => __awaiter(void 0, void 0, void 0, function* () {
    return ({
        id: offer.id,
        name: offer.name,
        image: offer.image,
    });
});
exports.offerMapper = offerMapper;
const offerListMapper = (offersList) => __awaiter(void 0, void 0, void 0, function* () {
    return offersList.map(offer => ({
        id: offer.id,
        name: offer.name,
        image: offer.image
    }));
});
exports.offerListMapper = offerListMapper;
