import { Router } from "express";

import UserControllers from "./user.controllers";

import { protect } from "../../shared/middlewares/protection";
import { allowTo } from "../../shared/middlewares/user.permissions";
import postRoutes from "./../post/post.routes";
import relationshipsRoutes from "./../relationship/relationship.routes";
import { uploadSingleImage } from "./../../shared/middlewares/multer";

import {
  createNewUserValidator,
  deleteSpecificUserValidator,
  getSpecificUserValidator,
  updateLoggedUserDataValidator,
  updateLoggedUserPasswordValidator,
  updateSpecificUserValidator,
} from "./user.validator";

const router = Router();
const userControllers = new UserControllers();

router.use("/:authorId/posts", postRoutes); //* nested route
router.use("/:userId/relationships", relationshipsRoutes); //* nested route

router.get("/search", protect, allowTo(["User"]), userControllers.searchForUsers);

router.use(protect, allowTo(["Admin", "User"]));
router
  .post(
    "/update/loggedUserData",
    uploadSingleImage("avatar"),
    updateLoggedUserDataValidator,
    userControllers.updateLoggedUserData
  )
  .post("/update/loggedUserPassword", updateLoggedUserPasswordValidator, userControllers.updateLoggedUserPassword);

router.use(protect, allowTo(["Admin"]));
router
  .route("/")
  .post(uploadSingleImage("avatar"), createNewUserValidator, userControllers.createNewUser)
  .get(userControllers.getAllUsers);
router
  .route("/:id")
  .get(getSpecificUserValidator, userControllers.getSpecificUser)
  .put(uploadSingleImage("avatar"), updateSpecificUserValidator, userControllers.UpdateSpecificUserData)
  .delete(deleteSpecificUserValidator, userControllers.deleteAUser);

export default router;
