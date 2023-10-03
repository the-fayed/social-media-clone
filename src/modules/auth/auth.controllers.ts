import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { loginBody, signupBody } from "./auth.interfaces";
import { sendEmail } from './../../shared/services/send.email';
import { verifyEmail } from "./../../shared/email.templates";

const prisma = new PrismaClient();

/**
 *  @desc     Login
 *  @route    POST /api/v1/auth/login
 *  @access   Public
 */
export const loginHandler = asyncHandler(async (req, res, next) => {
  const { email, password }: loginBody = req.body;
  console.log(email, password);
  const user = await prisma.user.findUnique({ where: { email: email } });
  const match = await bcrypt.compare(password, user.password);
  if (match) {
    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.EXPIRATION_PERIOD as string,
    });
    res.status(200).json({
      status: "success",
      data: user,
      accessToken: accessToken,
    });
  }
});

/**
 *  @desc     Login
 *  @route    POST /api/v1/auth/signup
 *  @access   Public
 */
export const signupHandler = asyncHandler(async (req, res, next) => {
  const { email, password, username, name, city, avatar, cover, website }: signupBody = req.body;
  const user = await prisma.user.create({
    data: {
      name: name,
      username: username,
      email: email,
      password: bcrypt.hashSync(password, 12),
      profile: {
        create: {
          city: city,
          avatar: avatar,
          cover: cover,
          website: website,
        },
      },
    },
  });
  await sendEmail(user.email, 'verify ur email', verifyEmail('hello'))
  res
    .status(201)
    .json({
      status: "success",
      message: "An email was sent to your email address, please verify your email to enjoy!",
    });
});
