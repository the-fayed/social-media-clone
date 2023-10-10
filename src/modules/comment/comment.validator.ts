import { check } from "express-validator";
import { PrismaClient } from "@prisma/client";

import { validatorMiddleware } from "./../../shared/middlewares/validator";

const prisma = new PrismaClient();

export const createNewCommentValidator = [
  check("postId")
    .notEmpty()
    .withMessage("Post id is required")
    .isNumeric()
    .withMessage("Invalid post id")
    .custom(async (value: string) => {
      const post = await prisma.post.findUnique({ where: { id: Number(value) } });
      if (!post) throw new Error("Post not found");
    }),
  check("desc")
    .notEmpty()
    .withMessage("Comment description is required")
    .isLength({ max: 520 })
    .withMessage("Too long comment description"),
  validatorMiddleware,
];

export const getAllCommentsValidator = [
  check("postId")
    .notEmpty()
    .withMessage("Post id is required")
    .isNumeric()
    .withMessage("Invalid post id")
    .custom(async (value: string, { req }) => {
      const post = await prisma.post.findUnique({ where: { id: Number(value) } });
      if (!post) throw new Error("Post not found");
    }),
  validatorMiddleware,
];

export const getSpecificCommentValidator = [
  check("id")
    .notEmpty()
    .withMessage("Post id is required")
    .isNumeric()
    .withMessage("Invalid post id")
    .custom(async (value: string) => {
      const comment = await prisma.comment.findUnique({ where: { id: Number(value) } });
      if (!comment) throw new Error("Comment not found");
    }),
  validatorMiddleware,
];

export const updateCommentValidator = [
  check("id")
    .notEmpty()
    .withMessage("Post id is required")
    .isNumeric()
    .withMessage("Invalid post id")
    .custom(async (value: string, { req }) => {
      const comment = await prisma.comment.findUnique({
        where: { id: Number(value), commentAuthorId: Number(req.user.id) },
      });
      if (!comment) throw new Error("Comment not found");
    }),
  check("desc")
    .notEmpty()
    .withMessage("Comment description is required")
    .isLength({ max: 520 })
    .withMessage("Too long comment description"),
  validatorMiddleware,
];

export const deleteCommentValidator = [
  check("id")
    .notEmpty()
    .withMessage("Post id is required")
    .isNumeric()
    .withMessage("Invalid post id")
    .custom(async (value: string) => {
      const comment = await prisma.comment.findUnique({
        where: { id: Number(value) },
      });
      if (!comment) throw new Error("Comment not found");
    }),
  validatorMiddleware,
];
