import { Router } from "express";

import controllers from "../controllers/bill.controllers";

const router = Router()
  .get("/", controllers.getByPagination)
  .get("/:id", controllers.getById)
  .post("/", controllers.insert)
  .put("/:id", controllers.updateById)
  .delete("/:id", controllers.deleteById);

export default router;
