"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_errors_1 = __importDefault(require("http-errors"));
const routes_1 = __importDefault(require("./routes/routes"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
// Config Express
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use(routes_1.default);
// Serves images
app.use("/public", express_1.default.static("./public/images"));
// Handle Error
app.all("*", (req, res
// next: NextFunction
) => {
    if (req)
        return res.send((0, http_errors_1.default)(500));
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.info(`server up on port ${PORT}`);
});
