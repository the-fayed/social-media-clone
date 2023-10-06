import { Router } from "express";

import UserControllers from "./user.controllers";
import {
  createNewUserValidator,
  deleteSpecificUserValidator,
  getSpecificUserValidator,
  updateLoggedUserDataValidator,
  updateLoggedUserPasswordValidator,
  updateSpecificUserValidator,
} from "./user.validator";

import { protect } from "../../shared/middlewares/protection";
import { allowTo } from "../../shared/middlewares/user.permissions";
import postRoutes from './../post/post.routes';

const router = Router();
const userControllers = new UserControllers();

router.use('/:authorId/posts', postRoutes); //* nested route

router.use(protect, allowTo(["Admin", "User"]));
router
.post("/update/loggedUserData", updateLoggedUserDataValidator, userControllers.updateLoggedUserData)
.post("/update/loggedUserPassword", updateLoggedUserPasswordValidator, userControllers.updateLoggedUserPassword);

router.use(protect, allowTo(["Admin"]));
router.route("/").post(createNewUserValidator, userControllers.createNewUser).get(userControllers.getAllUsers);
router
  .route("/:id")
  .get(getSpecificUserValidator, userControllers.getSpecificUser)
  .put(updateSpecificUserValidator, userControllers.UpdateSpecificUserData)
  .delete(deleteSpecificUserValidator, userControllers.deleteAUser);
export default router;
