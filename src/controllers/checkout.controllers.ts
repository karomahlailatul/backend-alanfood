import { Request, Response } from "express";
import createHttpError from "http-errors";
import responseHelper from "../utils/response.utils";

import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

interface Pagination {
  page: number;
  limit: number;
  totalData: number;
  totalPage: number;
}

interface RequestBody {
  isPay?: boolean;
  totalPay: number;
  changePay: number;
  foodId: number[];
  foodCount: number[];
}

const Controller = {
  getByPagination: async (req: Request, res: Response) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const search = req.query.search as string;
      // const searchBy = req.query.searchby || "";

      let whereClause: any = {};

      if (search) {
        whereClause = {
          name: {
            contains: search,
            mode: "insensitive",
          },
        };
      }

      const totalData = await prisma.checkout.count({ where: whereClause });

      const sortby = (req.query.sortby || "createdAt") as string;
      const sort = (req.query.sort || "desc") as string;
      const result = await prisma.checkout.findMany({
        take: limit,
        skip: offset,
        orderBy: {
          [sortby]: sort,
        },
        where: whereClause,
      });

      const totalPage = Math.ceil(totalData / limit);
      const pagination: Pagination = {
        page,
        limit,
        totalData,
        totalPage,
      };

      responseHelper(res, result, 200, "Success get data", pagination);
    } catch (error) {
      console.error(error);
      res.send(createHttpError(404));
    }
  },

  getById: async (req: Request, res: Response) => {
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
        if (!data?.id) throw new Error("Not found");
      } catch (error) {
        return responseHelper(res, null, 404, error.message);
      }

      responseHelper(res, data, 200);
    } catch (error) {
      console.log(error);
      res.send(createHttpError(404));
    }
  },

  insert: async (req: Request, res: Response) => {
    try {
      const { totalPay, changePay, isPay }: RequestBody = req.body;

      await prisma.checkout.create({
        data: {
          totalPay: Number(totalPay),
          changePay: Number(changePay),
          isPay: isPay ?? false,
        },
      });

      responseHelper(res, null, 200, "Success created");
    } catch (error) {
      console.log(error);
      res.send(createHttpError(400));
    }
  },

  updateById: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const data = await prisma.checkout.findUnique({
        where: {
          id: id,
        },
      });

      try {
        if (!data?.id) throw new Error("Not found");
      } catch (error) {
        return responseHelper(res, null, 404, error.message);
      }

      const { totalPay, changePay, isPay }: RequestBody = req.body;

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

      responseHelper(res, null, 200, "Success updated");
    } catch (error) {
      console.log(error);
      res.send(createHttpError(400));
    }
  },

  deleteById: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      await prisma.checkout.delete({
        where: {
          id: id,
        },
      });

      responseHelper(res, null, 200, "Success deleted");
    } catch (error) {
      console.log(error);
      res.send(createHttpError(404));
    }
  },

  // Core Function
  insertOrder: async (req: Request, res: Response) => {
    try {
      const { totalPay, changePay, isPay, foodId, foodCount }: RequestBody =
        req.body;

      if (foodId?.length === 0) {
        return responseHelper(res, null, 400, "Food id is required");
      }

      await prisma.checkout.create({
        data: {
          totalPay: Number(totalPay),
          changePay: Number(changePay),
          isPay: isPay ?? false,
          bill: {
            create: foodId?.map((e: number, i: number) => ({
              foodId: e,
              count: foodCount[i],
            })),
          },
        },
      });

      responseHelper(res, null, 200, "Success created");
    } catch (error) {
      console.log(error);
      res.send(createHttpError(400));
    }
  },
  updateOrder: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const data = await prisma.checkout.findUnique({
        where: {
          id: id,
        },
      });

      try {
        if (!data?.id) throw new Error("Not found");
      } catch (error) {
        return responseHelper(res, null, 404, error.message);
      }

      const { isPay }: RequestBody = req.body;
      await prisma.checkout.update({
        where: {
          id: id,
        },
        data: {
          isPay: isPay ?? false,
        },
      });

      responseHelper(res, null, 200, "Success updated");
    } catch (error) {
      console.log(error);
      res.send(createHttpError(400));
    }
  },
};

export default Controller;
