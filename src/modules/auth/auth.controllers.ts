import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { loginBody } from './auth.interfaces';


const prisma = new PrismaClient();

/**
 *  @desc     Login
 *  @route    POST /api/v1/auth/login
 *  @access   Public
 */
export const loginHandler = asyncHandler(async (req, res, next) => {
  const {email, password}: loginBody = req.body;
  console.log(email, password);
  const user = await prisma.user.findUnique({where: {email: email}});
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
})