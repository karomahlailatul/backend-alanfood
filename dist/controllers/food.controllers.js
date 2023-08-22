"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const response_utils_1 = __importDefault(require("../utils/response.utils"));
const client_1 = require("@prisma/client");
const google_cloud_services_1 = require("../services/google-cloud.services");
const prisma = new client_1.PrismaClient();
const Controller = {
    getByPagination: async (req, res) => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const search = req.query.search;
            // const searchBy = req.query.searchby || "";
            let whereClause = {};
            if (search) {
                whereClause = {
                    name: {
                        contains: search,
                        mode: "insensitive",
                    },
                };
            }
            const totalData = await prisma.food.count({ where: whereClause });
            const sortby = (req.query.sortby || "createdAt");
            const sort = (req.query.sort || "desc");
            const result = await prisma.food.findMany({
                take: limit,
                skip: offset,
                orderBy: {
                    [sortby]: sort,
                },
                where: whereClause,
            });
            const totalPage = Math.ceil(totalData / limit);
            const pagination = {
                page,
                limit,
                totalData,
                totalPage,
            };
            (0, response_utils_1.default)(res, result, 200, "Success get data", pagination);
        }
        catch (error) {
            console.error(error);
            res.send((0, http_errors_1.default)(404));
        }
    },
    getById: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const data = await prisma.food.findUnique({
                where: {
                    id: id,
                },
            });
            try {
                if (!data?.id)
                    throw new Error("Not Found");
            }
            catch (error) {
                return (0, response_utils_1.default)(res, null, 404, error.message);
            }
            (0, response_utils_1.default)(res, data, 200);
        }
        catch (error) {
            console.log(error);
            res.send((0, http_errors_1.default)(404));
        }
    },
    insert: async (req, res) => {
        try {
            try {
                if (!req.file)
                    throw new Error("File is not found");
            }
            catch (error) {
                return (0, response_utils_1.default)(res, null, 404, error.message);
            }
            // Upload to Drive
            const auth = (0, google_cloud_services_1.authenticateGoogle)();
            const response = await (0, google_cloud_services_1.uploadToGoogleDrive)(req.file, auth);
            const image = `https://drive.google.com/thumbnail?id=${response.data.id}&sz=s1080`;
            const { name, description, price } = req.body;
            await prisma.food.create({
                data: {
                    name: name,
                    description: description,
                    price: Number(price),
                    image: image,
                },
            });
            (0, response_utils_1.default)(res, null, 200, "Success created");
        }
        catch (error) {
            console.log(error);
            res.send((0, http_errors_1.default)(400));
        }
    },
    updateById: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const data = await prisma.food.findUnique({
                where: {
                    id: id,
                },
            });
            try {
                if (!data?.id)
                    throw new Error("Not found");
            }
            catch (error) {
                return (0, response_utils_1.default)(res, null, 404, error.message);
            }
            const { name, description, price } = req.body;
            if (!req.file) {
                const { name, description, price } = req.body;
                await prisma.food.update({
                    where: {
                        id: id,
                    },
                    data: {
                        name: name,
                        description: description,
                        price: Number(price),
                    },
                });
            }
            else {
                // Upload to Drive
                const auth = (0, google_cloud_services_1.authenticateGoogle)();
                const response = await (0, google_cloud_services_1.uploadToGoogleDrive)(req.file, auth);
                const image = `https://drive.google.com/thumbnail?id=${response.data.id}&sz=s1080`;
                await prisma.food.update({
                    where: {
                        id: id,
                    },
                    data: {
                        name: name,
                        description: description,
                        price: Number(price),
                        image: image,
                    },
                });
            }
            (0, response_utils_1.default)(res, null, 200, "Success updated");
        }
        catch (error) {
            console.log(error);
            res.send((0, http_errors_1.default)(400));
        }
    },
    deleteById: async (req, res) => {
        try {
            const id = Number(req.params.id);
            await prisma.food.delete({
                where: {
                    id: id,
                },
            });
            (0, response_utils_1.default)(res, null, 200, "Success deleted");
        }
        catch (error) {
            console.log(error);
            res.send((0, http_errors_1.default)(404));
        }
    },
};
exports.default = Controller;
