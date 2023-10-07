import { Router } from "express";

import PostController from "./post.controller";
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
