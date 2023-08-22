import { config } from "dotenv";

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import createHttpError from "http-errors";

import routes from "./routes/routes";

config();
const app = express();

// Config Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
  })
);

app.use(routes);

// Serves images
app.use("/public", express.static("./public/images"));

// Handle Error
app.all(
  "*",
  (
    req: Request,
    res: Response
    // next: NextFunction
  ) => {
    if (req) return res.send(createHttpError(500));
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.info(`server up on port ${PORT}`);
});
