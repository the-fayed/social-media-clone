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

import { isAuthorized } from './../../shared/middlewares/authorization';

const router = Router();

router.route("/").post(createNewUserValidator, createNewUserHandler).get(isAuthorized(), getAllUsersHandler);

router
  .route("/:id")
  .get(getSpecificUserValidator, getSpecificUserHandler)
  .put(updateSpecificUserValidator, updateSpecificUserHandler)
  .delete(deleteSpecificUserValidator, deleteSpecificUserHandler);

export default router;
