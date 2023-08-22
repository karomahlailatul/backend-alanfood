"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const response_utils_1 = __importDefault(require("../utils/response.utils"));
const client_1 = require("@prisma/client");
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
            const totalData = await prisma.bill.count({ where: whereClause });
            const sortby = (req.query.sortby || "createdAt");
            const sort = (req.query.sort || "desc");
            const result = await prisma.bill.findMany({
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
            const data = await prisma.bill.findUnique({
                where: {
                    id: id,
                },
                include: {
                    // food: true, // Include the related Food data
                    food: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            price: true,
                        },
                    },
                },
            });
            try {
                if (!data?.id)
                    throw new Error("Not found");
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
            const { count, foodId, checkoutId } = req.body;
            await prisma.bill.create({
                data: {
                    count: Number(count),
                    foodId: Number(foodId),
                    checkoutId: Number(checkoutId)
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
            const data = await prisma.bill.findUnique({
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
            const { count, foodId, checkoutId } = req.body;
            await prisma.bill.update({
                where: {
                    id: id,
                },
                data: {
                    count: Number(count),
                    foodId: Number(foodId),
                    checkoutId: Number(checkoutId)
                },
            });
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
            await prisma.bill.delete({
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
