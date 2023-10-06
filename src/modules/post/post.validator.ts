import { check } from "express-validator";
import { PrismaClient } from "@prisma/client";

import { validatorMiddleware } from "./../../shared/middlewares/validator";

const prisma = new PrismaClient();

export const createNewPostValidator = [
  check("desc")
    .notEmpty()
    .withMessage("Post description is required")
    .isLength({ max: 500 })
    .withMessage("Too long post description"),
  check("image").optional().isString().withMessage("Unacceptable image"),
  validatorMiddleware,
];

export const updatePostValidator = [
  check("id")
    .notEmpty()
    .withMessage("post id is required")
    .isNumeric()
    .withMessage("Invalid post id")
    .custom(async (value: string, { req }) => {
      const post = await prisma.post.findUnique({ where: { id: Number(value), postAuthorId: req.user.id } });
      if (!post || post === null) throw new Error("Post not found");
    }),
  check("desc").optional().isLength({ max: 500 }).withMessage("Too long post description"),
  check("image").optional().isString().withMessage("Unacceptable image"),
  validatorMiddleware,
];

export const getSpecificPostValidator = [
  check("id")
    .notEmpty()
    .withMessage("post id is required")
    .isNumeric()
    .withMessage("Invalid post id")
    .custom(async (value: string, { req }) => {
      const post = await prisma.post.findUnique({ where: { id: Number(value) } });
      if (!post || post === null) throw new Error("Post not found");
    }),
  validatorMiddleware,
];

export const deleteSpecificPostValidator = [
  check("id")
    .notEmpty()
    .withMessage("post id is required")
    .isNumeric()
    .withMessage("Invalid post id")
    .custom(async (value: string, { req }) => {
      const post = await prisma.post.findFirst({ where: { id: Number(value), postAuthorId: req.user.id } });
      if (!post || post === null) throw new Error("Post not found");
    }),
    validatorMiddleware,
];
