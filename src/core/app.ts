const sanitizer = require("express-sanitizer");
import compression from "compression";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import hpp from "hpp";

import globalErrorHandler from "../shared/middlewares/error.handling";
import { limiter } from "../shared/middlewares/rate.limiter";
import { routesMounter } from "../modules/routes";
import ApiError from "../shared/utils/api.error";

const app: express.Application = express();

// Public middlewares

// applying cors
app.use(cors());
app.options("*", cors());

// applying compression
app.use(compression());

// applying rate limiter
app.use(limiter);

app.use(express.json({ limit: "30kb" }));
app.use(express.urlencoded({ extended: true, limit: "30kb" }));

// applying hpp
app.use(hpp());

// applying sanitizer
app.use(
  sanitizer({
    sql: true,
    xss: true,
    level: 5,
  })
);

// Logging in development mode
if (process.env.MODE === "Development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.MODE}`);
}

routesMounter(app);

// Unhandled routes
app.use("*", (req, res, next) => {
  next(new ApiError(`Route ${req.originalUrl} dose not exist`, 400));
});

// Mount global error handling middleware
app.use(globalErrorHandler);

app.use("/", (req, res, next) => {
  res.send("Social Media Clone");
});

export default app;
