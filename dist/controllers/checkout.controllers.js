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
            const totalData = await prisma.checkout.count({ where: whereClause });
            const sortby = (req.query.sortby || "createdAt");
            const sort = (req.query.sort || "desc");
            const result = await prisma.checkout.findMany({
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
            const data = await prisma.checkout.findUnique({
                where: {
                    id: id,
                },
                include: {
                    // bill: {
                    //   include: {
                    //     food: true,
                    //   },
                    // }
                    bill: {
                        select: {
                            id: true,
                            count: true,
                            foodId: true,
                            checkoutId: true,
                            food: {
                                select: {
                                    id: true,
                                    name: true,
                                    description: true,
                                    price: true,
                                },
                            },
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
            const { totalPay, changePay, isPay } = req.body;
            await prisma.checkout.create({
                data: {
                    totalPay: Number(totalPay),
                    changePay: Number(changePay),
                    isPay: isPay ?? false,
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
            const data = await prisma.checkout.findUnique({
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
            const { totalPay, changePay, isPay } = req.body;
            await prisma.checkout.update({
                where: {
                    id: id,
                },
                data: {
                    totalPay: Number(totalPay),
                    changePay: Number(changePay),
                    isPay: isPay ?? false,
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
            await prisma.checkout.delete({
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
    // Core Function
    insertOrder: async (req, res) => {
        try {
            const { totalPay, changePay, isPay, foodId, foodCount } = req.body;
            if (foodId?.length === 0) {
                return (0, response_utils_1.default)(res, null, 400, "Food id is required");
            }
            await prisma.checkout.create({
                data: {
                    totalPay: Number(totalPay),
                    changePay: Number(changePay),
                    isPay: isPay ?? false,
                    bill: {
                        create: foodId?.map((e, i) => ({
                            foodId: e,
                            count: foodCount[i],
                        })),
                    },
                },
            });
            (0, response_utils_1.default)(res, null, 200, "Success created");
        }
        catch (error) {
            console.log(error);
            res.send((0, http_errors_1.default)(400));
        }
    },
    updateOrder: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const data = await prisma.checkout.findUnique({
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
            const { isPay } = req.body;
            await prisma.checkout.update({
                where: {
                    id: id,
                },
                data: {
                    isPay: isPay ?? false,
                },
            });
            (0, response_utils_1.default)(res, null, 200, "Success updated");
        }
        catch (error) {
            console.log(error);
            res.send((0, http_errors_1.default)(400));
        }
    },
};
exports.default = Controller;
