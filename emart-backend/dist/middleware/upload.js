"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const multer = require("multer");
const diskStore = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.mkdirSync(req.upload_path, { recursive: true });
        cb(null, req.upload_path);
    },
    filename: (req, file, cb) => {
        let file_name = Date.now() + file.originalname;
        cb(null, file_name);
    }
});
const storage = multer.memoryStorage();
const imgFilter = (req, file, cb) => {
    let ext = (file.originalname.split(".")).pop();
    if (["jpeg", "jpg", "png", "webp", "svg", "bmp"].includes(ext.toLowerCase())) {
        cb(null, true);
    }
    else {
        cb({ status: 400, msg: "Invalid image format" }, null);
    }
};
const uploader = multer({
    storage: storage,
    limits: {
        fileSize: 4 * 1024 * 1024,
    },
    fileFilter: imgFilter
});
module.exports = uploader;
