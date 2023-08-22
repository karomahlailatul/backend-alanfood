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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importStar(require("multer"));
const http_errors_1 = __importDefault(require("http-errors"));
const fileStorage = (0, multer_1.diskStorage)({
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + "-" + file.originalname.replace(/ /g, "-"));
    },
});
const fileFilter = (req, file, cb) => {
    const fileSize = parseInt(req.headers["content-length"] || "0", 10);
    try {
        if (fileSize > 2 * 1024 * 1024) {
            throw new Error("File Picture more than 2MB");
        }
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            throw new Error("File Picture format must be PNG, JPG, or JPEG");
        }
        cb(null, true);
    }
    catch (error) {
        cb((0, http_errors_1.default)(400, error.message));
    }
};
const upload = (0, multer_1.default)({
    storage: fileStorage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2 MB (max file size)
    },
    fileFilter: fileFilter,
});
exports.default = upload;
