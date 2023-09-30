import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

/**
 *  @desc   Create a new user
 *  @route  GET /api/v1/users
 *  @access Privet (Admin)
 */
export const createUser = asyncHandler(async (req, res, next) => {
  const {email, password, name, username} = req.body;
  const user = await prisma.user.create({
    data: {
      name: name,
      username: username,
      email: email,
      password: password
    }
  })
});
