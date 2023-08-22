"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const food_controllers_1 = __importDefault(require("../controllers/food.controllers"));
const multer_middlewares_1 = __importDefault(require("../middlewares/multer.middlewares"));
const router = (0, express_1.Router)()
    .get("/", food_controllers_1.default.getByPagination)
    .get("/:id", food_controllers_1.default.getById)
    .post("/", multer_middlewares_1.default.single("image"), food_controllers_1.default.insert)
    .put("/:id", multer_middlewares_1.default.single("image"), food_controllers_1.default.updateById)
    .delete("/:id", food_controllers_1.default.deleteById);
exports.default = router;
