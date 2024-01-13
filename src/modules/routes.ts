import express from 'express';

import relationshipRoutes from "./relationship/relationship.routes";
import commentRoutes from "./comment/comment.routes";
import storyRoutes from "./story/story.routes";
import userRoutes from "./user/user.routes";
import authRoutes from "./auth/auth.routes";
import postRoutes from "./post/post.routes";
import likeRoutes from "./like/like.routes";

export const routesMounter = (app: express.Application) => {
  app.use("/api/v1/relationships", relationshipRoutes);
  app.use("/api/v1/comments", commentRoutes);
  app.use("/api/v1/stories", storyRoutes);
  app.use("/api/v1/posts", postRoutes);
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/likes", likeRoutes);
  app.use("/api/v1/auth", authRoutes);
};
