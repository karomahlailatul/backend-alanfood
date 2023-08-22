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
  id? : number;
  count: number;
  foodId: number;
  checkoutId: number;
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

      const totalData = await prisma.bill.count({ where: whereClause });

      const sortby = (req.query.sortby || "createdAt") as string;
      const sort = (req.query.sort || "desc") as string;
      const result = await prisma.bill.findMany({
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
      const { count, foodId, checkoutId }: RequestBody = req.body;

      await prisma.bill.create({
        data: {
          count: Number(count),
          foodId: Number(foodId),
          checkoutId: Number(checkoutId) 
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

      const data = await prisma.bill.findUnique({
        where: {
          id: id,
        },
      });

      try {
        if (!data?.id) throw new Error("Not found");
      } catch (error) {
        return responseHelper(res, null, 404, error.message);
      }

      const { count, foodId, checkoutId }: RequestBody = req.body;

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

      responseHelper(res, null, 200, "Success updated");
    } catch (error) {
      console.log(error);
      res.send(createHttpError(400));
    }
  },

  deleteById: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      await prisma.bill.delete({
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
};

export default Controller;
