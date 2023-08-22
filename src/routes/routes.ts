import { Router } from "express";
import foodRoutes from "./food.routes";
import checkoutRoutes from "./checkout.routes";
import billRoutes from "./bill.routes";

const api = Router()
  .use("/food", foodRoutes)
  .use("/checkout", checkoutRoutes)
  .use("/bill", billRoutes);

export default Router().use("/api", api);
