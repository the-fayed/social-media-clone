import { check } from "express-validator";
import { PrismaClient } from "@prisma/client";

import { validatorMiddleware } from "./../../shared/middlewares/validator";

const prisma = new PrismaClient();

export const createNewConversationValidator = [
  check("receiverId")
    .notEmpty()
    .withMessage("Receiver id is required")
    .isNumeric()
    .withMessage("Invalid receiver id")
    .custom(async (value: number) => {
      const exist = await prisma.user.findUnique({ where: { id: value } });
      if (!exist) throw new Error("User you want to create conversation with is not found");
    }),
  validatorMiddleware,
];
