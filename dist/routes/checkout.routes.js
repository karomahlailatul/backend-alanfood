"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkout_controllers_1 = __importDefault(require("../controllers/checkout.controllers"));
const router = (0, express_1.Router)()
    .get("/", checkout_controllers_1.default.getByPagination)
    .get("/:id", checkout_controllers_1.default.getById)
    .post("/", checkout_controllers_1.default.insert)
    .post("/order", checkout_controllers_1.default.insertOrder)
    .put("/:id", checkout_controllers_1.default.updateById)
    .put("/order", checkout_controllers_1.default.updateOrder)
    .delete("/:id", checkout_controllers_1.default.deleteById);
exports.default = router;
