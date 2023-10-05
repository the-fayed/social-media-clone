import { Router } from "express";
import AuthController from "./auth.controllers";

import {
  forgotPasswordValidator,
  loginValidator,
  resetPasswordValidator,
  signupValidator,
  verifyEmailTokenValidator,
  verifyPasswordResetTokenValidator,
} from "./auth.validator";

const router = Router();
const authController = new AuthController();

router
  .post("/signup", signupValidator, authController.signup)
  .post("/login", loginValidator, authController.login)
  .get("/verify/email/:token", verifyEmailTokenValidator, authController.verifyEmailToken)
  .post("/forgotPassword", forgotPasswordValidator, authController.forgotPassword)
  .post("/verify/passwordResetCode", verifyPasswordResetTokenValidator, authController.verifyPasswordResetCode)
  .post("/resetPassword", resetPasswordValidator, authController.resetPassword);

export default router;
