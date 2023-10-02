import { check } from "express-validator";
import { PrismaClient } from "@prisma/client";
import { validatorMiddleware } from "./../../shared/middlewares/validator";

const prisma = new PrismaClient();

export const createNewUserValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (value: string) => {
      const existed = await prisma.user.findUnique({ where: { email: value } });
      if (existed) throw new Error("Email already in use.");
    }),
  check("username")
    .notEmpty()
    .withMessage("Username is required")
    .isString()
    .withMessage("Invalid username")
    .custom(async (value: string) => {
      const existed = prisma.user.findUnique({ where: { username: value } });
      if (existed) throw new Error("Unavailable username");
    }),
  check("name")
    .notEmpty()
    .withMessage("Full name is required")
    .isString()
    .withMessage("Invalid name")
    .isLength({ min: 3, max: 32 })
    .withMessage("Name must be at least 3 characters and 32 character long."),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Too week password"),
  check("passwordConfirmation").custom((value: string, { req }) => {
    if (!value || value === req.body.password) throw new Error("Password and confirmation do not match");
  }),
  check("avatar").optional().isString(),
  check("cover").optional().isString(),
  check("city").notEmpty().withMessage("City is required").isAlpha().withMessage("Invalid city name"),
  check("website").optional().isLength({ max: 100 }).withMessage("Invalid website"),
  validatorMiddleware,
];

export const getSpecificUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("User id is required")
    .isNumeric()
    .withMessage("Invalid user id")
    .custom(async (value: string) => {
      const user = await prisma.user.findUnique({ where: { id: Number(value) } });
      if (!user) throw new Error("User not found");
    }),
  validatorMiddleware,
];

export const updateSpecificUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("User id is required")
    .isNumeric()
    .withMessage("Invalid user id")
    .custom(async (value: string) => {
      const user = await prisma.user.findUnique({ where: { id: Number(value) } });
      if (!user) throw new Error("User not found");
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (value: string) => {
      const existed = await prisma.user.findUnique({ where: { email: value } });
      if (existed) throw new Error("Email already in use.");
    }),
  check("username")
    .optional()
    .isString()
    .withMessage("Invalid username")
    .custom(async (value: string) => {
      const existed = prisma.user.findUnique({ where: { username: value } });
      if (existed) throw new Error("Unavailable username");
    }),
  check("name")
    .optional()
    .isString()
    .withMessage("Invalid name")
    .isLength({ min: 3, max: 32 })
    .withMessage("Name must be at least 3 characters and 32 character long."),
  check("avatar").optional().isString(),
  check("cover").optional().isString(),
  check("city").optional().isAlpha().withMessage("Invalid city name"),
  check("website").optional().isLength({ max: 100 }).withMessage("Invalid website"),
  validatorMiddleware
];

export const deleteSpecificUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("User id is required")
    .isNumeric()
    .withMessage("Invalid user id")
    .custom(async (value: string) => {
      const user = await prisma.user.findUnique({ where: { id: Number(value) } });
      if (!user || user.isActive === false) throw new Error("User not found");
    }),
    validatorMiddleware
];