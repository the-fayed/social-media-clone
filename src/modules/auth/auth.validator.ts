import { check } from "express-validator";
import { PrismaClient } from "@prisma/client";
import { validatorMiddleware } from "./../../shared/middlewares/validator";
import ApiError from './../../shared/utils/api.error';

const prisma = new PrismaClient();

export const signupValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email address is required")
    .isEmail()
    .withMessage("Invalid Email address")
    .custom(async (value: string) => {
      const exist = await prisma.user.findUnique({ where: { email: value } });
      if (exist) throw new Error("Email already in use");
    }),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 32 })
    .withMessage("Password must be between 8 to 32 characters"),
  check("passwordConfirmation")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((value: string, { req }) => {
      if (!value === req.body.password) throw new Error("Password and password confirmation must match");
      return true;
    }),
  check("name")
    .notEmpty()
    .withMessage("User full name is required")
    .isLength({ min: 3, max: 32 })
    .withMessage("User full name must be between 3 to 32 characters"),
  check("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 32 })
    .withMessage("Username must be between 3 to 32 characters")
    .custom(async (value: string) => {
      const exist = await prisma.user.findUnique({ where: { username: value } });
      if (exist) throw new Error("Unavailable username");
    }),
  check("city")
    .notEmpty()
    .withMessage("User city is required")
    .isAlpha()
    .withMessage("Invalid city name")
    .isLength({ min: 3, max: 32 })
    .withMessage("Invalid city name"),
  check("website").optional().isString().withMessage("Invalid user website"),
  check("avatar").optional().isString().withMessage("Invalid user avatar"),
  check("cover").optional().isString().withMessage("Invalid cover photo"),
  validatorMiddleware,
];

export const loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid Email address")
    .custom(async (value: string) => {
      const exist = await prisma.user.findUnique({ where: { email: value } });
      if (!exist) throw new Error("No such email");
    }),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 32 })
    .withMessage("Invalid password"),
  validatorMiddleware,
];

export const verifyEmailTokenValidator = [
  check("token")
    .notEmpty()
    .withMessage("Email verification token is required")
    .custom(async (value: string) => {
      const exist = await prisma.user.findUnique({ where: { emailVerificationToken: value } });
      if (!exist) throw new Error("Invalid or expired token");
    }),
  validatorMiddleware,
];

export const forgotPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (value: string) => {
      const exist = await prisma.user.findUnique({ where: { email: value } });
      if (!exist) throw new Error("user not found");
    }),
  validatorMiddleware,
];

export const verifyPasswordResetTokenValidator = [
  check("resetCode")
    .notEmpty()
    .withMessage("Password reset code is required")
    .isString()
    .withMessage("Invalid password reset code")
    .isLength({ max: 6 })
    .withMessage("Invalid password reset code"),
  validatorMiddleware,
];

export const resetPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (value: string) => {
      const exist = await prisma.user.findUnique({ where: { email: value } });
      if (!exist) throw new Error("user not found");
    }),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 32 })
    .withMessage("Password must be between 8 to 32 characters"),
  check("passwordConfirmation")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((value: string, { req }) => {
      if (!value === req.body.password) throw new Error("Password and password confirmation must match");
      return true;
    }),
  validatorMiddleware,
];
