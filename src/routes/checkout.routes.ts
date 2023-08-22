import { Router } from "express";

import controllers from "../controllers/checkout.controllers";

const router = Router()
  .get("/", controllers.getByPagination)
  .get("/:id", controllers.getById)
  .post("/", controllers.insert)
  .post("/order", controllers.insertOrder)
  .put("/:id", controllers.updateById)
  .put("/order", controllers.updateOrder)
  .delete("/:id", controllers.deleteById);

export default router;
