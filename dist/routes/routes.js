"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const food_routes_1 = __importDefault(require("./food.routes"));
const checkout_routes_1 = __importDefault(require("./checkout.routes"));
const bill_routes_1 = __importDefault(require("./bill.routes"));
const api = (0, express_1.Router)()
    .use("/food", food_routes_1.default)
    .use("/checkout", checkout_routes_1.default)
    .use("/bill", bill_routes_1.default);
exports.default = (0, express_1.Router)().use("/api", api);
