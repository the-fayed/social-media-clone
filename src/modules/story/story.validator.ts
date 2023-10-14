import { check } from "express-validator";
import { PrismaClient } from "@prisma/client";
import { validatorMiddleware } from "./../../shared/middlewares/validator";

const prisma = new PrismaClient();

export const createStoryValidator = [
  check("image").notEmpty().withMessage("Story image is required"),
  check("privacy")
    .optional()
    .custom((value: string) => {
      if (!["public", "followers", "noone"].includes(value.toLowerCase())) throw new Error("Invalid privacy input");
      return true;
    }),
  validatorMiddleware,
];

export const getSpecificStoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("story id is required")
    .isNumeric()
    .withMessage("Invalid story id")
    .custom(async (value: string) => {
      const story = await prisma.story.findUnique({ where: { id: Number(value) } });
      if (!story) throw new Error("Story not found");
    }),
  validatorMiddleware,
];

export const updateStoryPrivacyValidator = [
  check("id")
    .notEmpty()
    .withMessage("story id is required")
    .isNumeric()
    .withMessage("Invalid story id")
    .custom(async (value: string, { req }) => {
      const story = await prisma.story.findUnique({ where: { id: Number(value), storyAuthorId: Number(req.user.id) } });
      if (!story) throw new Error("Story not found");
    }),
  check("privacy")
    .optional()
    .custom((value: string) => {
      if (!["public", "followers", "noone"].includes(value.toLowerCase())) throw new Error("Invalid privacy input");
      return true;
    }),
  validatorMiddleware,
];

export const deleteStoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("story id is required")
    .isNumeric()
    .withMessage("Invalid story id")
    .custom(async (value: string, { req }) => {
      const story = await prisma.story.findUnique({ where: { id: Number(value), storyAuthorId: Number(req.user.id) } });
      if (!story) throw new Error("Story not found");
    }),
    validatorMiddleware
];
