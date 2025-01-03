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
exports.imageUploadToFirebase = void 0;
const firebase_1 = require("../firebase");
const imageUploadToFirebase = (images, folder) => __awaiter(void 0, void 0, void 0, function* () {
    const uploadPromises = images.map((file) => {
        const blob = firebase_1.bucket.file(`uploads/${folder ? folder + '/' : ''}${file.originalname}`);
        const blobStream = blob.createWriteStream({
            metadata: { contentType: file.mimetype },
        });
        return new Promise((resolve, reject) => {
            blobStream.on("error", (err) => {
                reject(err);
            });
            blobStream.on("finish", () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield blob.makePublic(); // Make the file public
                    const publicUrl = `https://storage.googleapis.com/${firebase_1.bucket.name}/${blob.name}`;
                    resolve(publicUrl);
                }
                catch (err) {
                    reject(err);
                }
            }));
            blobStream.end(file.buffer);
        });
    });
    const imageUrls = yield Promise.all(uploadPromises);
    return imageUrls;
});
exports.imageUploadToFirebase = imageUploadToFirebase;
