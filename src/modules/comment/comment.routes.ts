import { Router } from "express";

import CommentControllers from "./comment.controllers";
import { protect } from "./../../shared/middlewares/protection";
import { allowTo } from "./../../shared/middlewares/user.permissions";
import {
  createNewCommentValidator,
  deleteCommentValidator,
  getAllCommentsValidator,
  getSpecificCommentValidator,
  updateCommentValidator,
} from "./comment.validator";

const router = Router({ mergeParams: true });
const commentControllers = new CommentControllers();

router.use(protect, allowTo(["User"]));

router
  .route("/")
  .post(createNewCommentValidator, commentControllers.createNewComment)
  .get(getAllCommentsValidator, commentControllers.getAllComments);
router
  .route("/:id")
  .get(getSpecificCommentValidator, commentControllers.getSpecificComment)
  .put(updateCommentValidator, commentControllers.updateSpecificComment)
  .delete(deleteCommentValidator, commentControllers.deleteSpecificComment);

export default router;
