import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { loginBody, signupBody } from "./auth.interfaces";
import { sendEmail } from "./../../shared/services/send.email";
import { verifyEmail } from "./../../shared/email.templates";
import { generateEmailVerificationToken } from "./../../shared/services/code.factor";
import ApiError from "./../../utils/api.error";

const prisma = new PrismaClient();

/**
 *  @desc     Login
 *  @route    POST /api/v1/auth/login
 *  @access   Public
 */
export const loginHandler = asyncHandler(async (req, res, next) => {
  const { email, password }: loginBody = req.body;
  const user = await prisma.user.findUnique({ where: { email: email } });
  if (!user.emailVerified) {
    if (user.emailVerificationToken) {
      await sendEmail(user.email, "Email Verification", verifyEmail(user.emailVerificationToken));
      return next(
        new ApiError("Your email is not verified, please check your email address to verify your email", 403)
      );
    }
    if (!user.emailVerificationToken) {
      await prisma.user.update({
        where: { id: user?.id },
        data: { emailVerificationToken: generateEmailVerificationToken() },
      });
      await sendEmail(user.email, "Email Verification", verifyEmail(user.emailVerificationToken));
      return next(
        new ApiError("Your email is not verified, please check your email address to verify your email", 403)
      );
    }
  }
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
      emailVerificationToken: generateEmailVerificationToken(),
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
  await sendEmail(user.email, "verify ur email", verifyEmail(user.emailVerificationToken));
  res.status(201).json({
    status: "success",
    message: "An email was sent to your email address, please verify your email to enjoy!",
  });
});

/**
 *  @desc     Verify email token
 *  @route    GET /api/v1/auth/verify/email/:token
 *  @access   Public
 */

export const verifyEmailTokenHandler = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const user = await prisma.user.findUnique({ where: { emailVerificationToken: token } });
  if (!user) return next(new ApiError("Invalid email verification token", 409));
  await prisma.user.update({
    where: { id: user?.id },
    data: {
      emailVerified: true,
      emailVerificationToken: null,
    },
  });
  res.status(200).json({ status: "success", message: "Email verified successfully!" });
});
