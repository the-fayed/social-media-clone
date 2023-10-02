import { Router } from "express";

import {
  createNewUserHandler,
  deleteSpecificUserHandler,
  getAllUsersHandler,
  getSpecificUserHandler,
  updateSpecificUserHandler,
} from "./user.controller";

import {
  createNewUserValidator,
  deleteSpecificUserValidator,
  getSpecificUserValidator,
  updateSpecificUserValidator,
} from "./user.validator";

import { protect } from "../../shared/middlewares/protection";
import { allowTo } from "../../shared/middlewares/user.permissions";

const router = Router();

router.use(protect, allowTo("Admin"));

router.route("/").post(createNewUserValidator, createNewUserHandler).get(getAllUsersHandler);

router
  .route("/:id")
  .get(getSpecificUserValidator, getSpecificUserHandler)
  .put(updateSpecificUserValidator, updateSpecificUserHandler)
  .delete(deleteSpecificUserValidator, deleteSpecificUserHandler);

export default router;
