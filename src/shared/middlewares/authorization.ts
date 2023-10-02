import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';

import ApiError from './../../utils/api.error';
import { decoded } from './../../modules/auth/auth.interfaces';

const prisma = new PrismaClient();

export const isAuthorized = () => {
  return asyncHandler(async (req, res, next) => {
    if (req.headers && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) return next (new ApiError(`You're not logged in, please login to continue`, 401));
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as decoded;
      const user = await prisma.user.findUnique({where: {id: Number(decoded.id)}});
      if (!user || !user.isActive) return next(new ApiError('Unauthorized', 401));
    }
  })
}