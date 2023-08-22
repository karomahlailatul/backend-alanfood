"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bill_controllers_1 = __importDefault(require("../controllers/bill.controllers"));
const router = (0, express_1.Router)()
    .get("/", bill_controllers_1.default.getByPagination)
    .get("/:id", bill_controllers_1.default.getById)
    .post("/", bill_controllers_1.default.insert)
    .put("/:id", bill_controllers_1.default.updateById)
    .delete("/:id", bill_controllers_1.default.deleteById);
exports.default = router;
