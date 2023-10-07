import { Router } from "express";

import PostController from "./post.controller";
import commentRoutes from './../comment/comment.routes';
import likeRoutes from './../like/like.routes';
import { protect } from "./../../shared/middlewares/protection";
import { allowTo } from "./../../shared/middlewares/user.permissions";

import {
  createNewPostValidator,
  deleteSpecificPostValidator,
  getSpecificPostValidator,
  updatePostValidator,
} from "./post.validator";

import { uploadSingleImage } from "./../../shared/middlewares/multer";

const router = Router({ mergeParams: true });
const postController = new PostController();

router.use('/:postId/comments', commentRoutes);
router.use('/:postId/likes', likeRoutes)

router.use(protect, allowTo(["User"]));

router
  .route("/")
  .post(uploadSingleImage("image"), createNewPostValidator, postController.createNewPost)
  .get(postController.getAllPosts);

router
  .route("/:id")
  .get(getSpecificPostValidator, postController.getSpecificPost)
  .put(uploadSingleImage('image'), updatePostValidator, postController.updateSpecificPost)
  .delete(deleteSpecificPostValidator, postController.deleteSpecificPost);

export default router;
