import { Router } from "express";

import controllers from "../controllers/food.controllers";
import uploader from "../middlewares/multer.middlewares";

const router = Router()
  .get("/", controllers.getByPagination)
  .get("/:id", controllers.getById)
  .post("/", uploader.single("image"), controllers.insert)
  .put("/:id", uploader.single("image"), controllers.updateById)
  .delete("/:id", controllers.deleteById);

export default router;
