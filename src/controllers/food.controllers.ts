import { Request, Response } from "express";
import createHttpError from "http-errors";
import responseHelper from "../utils/response.utils";

import { PrismaClient } from "@prisma/client";
import {
  authenticateGoogle,
  uploadToGoogleDrive,
} from "../services/google-cloud.services";

const prisma = new PrismaClient();

interface Pagination {
  page: number;
  limit: number;
  totalData: number;
  totalPage: number;
}

export interface RequestBody {
  id? : number;
  name: string;
  description: string;
  price: number;
  image?: string;
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

      const totalData = await prisma.food.count({ where: whereClause });

      const sortby = (req.query.sortby || "createdAt") as string;
      const sort = (req.query.sort || "desc") as string;
      const result = await prisma.food.findMany({
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

      const data = await prisma.food.findUnique({
        where: {
          id: id,
        },
        
      });

      try {
        if (!data?.id) throw new Error("Not Found");
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
      try {
        if (!req.file) throw new Error("File is not found");
      } catch (error) {
        return responseHelper(res, null, 404, error.message);
      }

      // Upload to Drive
      const auth = authenticateGoogle();
      const response = await uploadToGoogleDrive(req.file, auth);
      const image = `https://drive.google.com/thumbnail?id=${response.data.id}&sz=s1080`;

      const { name, description, price }: RequestBody = req.body;

      await prisma.food.create({
        data: {
          name: name,
          description: description,
          price: Number(price),
          image: image,
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

      const data = await prisma.food.findUnique({
        where: {
          id: id,
        },
      });

      try {
        if (!data?.id) throw new Error("Not found");
      } catch (error) {
        return responseHelper(res, null, 404, error.message);
      }

      const { name, description, price }: RequestBody = req.body;

      if (!req.file) {
        const { name, description, price }: RequestBody = req.body;

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
      } else {
        // Upload to Drive
        const auth = authenticateGoogle();
        const response = await uploadToGoogleDrive(req.file, auth);
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

      responseHelper(res, null, 200, "Success updated");
    } catch (error) {
      console.log(error);
      res.send(createHttpError(400));
    }
  },

  deleteById: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      await prisma.food.delete({
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
