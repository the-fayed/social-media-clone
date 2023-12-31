import express from "express";
import morgan from "morgan";
import compression from 'compression';
import cors from 'cors';

const app = express();

import globalErrorHandler from "../shared/middlewares/error.handling";
import ApiError from "../shared/utils/api.error";

// Importing routes
// User routes
import userRoutes from "../modules/user/user.routes";
// Auth routes
import authRoutes from "../modules/auth/auth.routes";
// Post routes
import postRoutes from "../modules/post/post.routes";
// Comment routes
import commentRoutes from "../modules/comment/comment.routes";
// Like routes
import likeRoutes from "../modules/like/like.routes";
// Relationship routes
import relationshipRoutes from "../modules/relationship/relationship.routes";
// Story routes
import storyRoutes from "../modules/story/story.routes";


// Public middlewares
app.use(cors());
app.options('*', cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging in development mode
if (process.env.MODE === "Development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.MODE}`);
}

// Mount routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/relationships", relationshipRoutes);
app.use("/api/v1/stories", storyRoutes);

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