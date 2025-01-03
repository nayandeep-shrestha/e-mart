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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const routes = require('./routes/');
const prisma_1 = __importDefault(require("./prisma"));
const http_exception_model_1 = __importDefault(require("./models/http-exception.model"));
dotenv_1.default.config();
const PORT = process.env.PORT || 8000;
// app.use("/images", express.static(process.cwd() + "/public/uploads/"))
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: false
}));
app.use(routes);
app.use((err, req, res, next) => {
    if (err instanceof http_exception_model_1.default) {
        res.status(err.errorCode).json({ error: err.message });
    }
    else {
        res.status(500).json({ error: err.message || 'An unexpected error occurred' });
    }
});
// Close Prisma Client when the process exits
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.$disconnect();
    process.exit();
}));
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.$disconnect();
    process.exit();
}));
app.listen(PORT, () => {
    console.log('listening to port' + PORT);
});
