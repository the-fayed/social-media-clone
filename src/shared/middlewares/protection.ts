import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { PrismaClient } from "@prisma/client";

import ApiError from "../utils/api.error";
import { AuthorizationRequest, Decoded } from "../../modules/auth/auth.interfaces";

const prisma = new PrismaClient();

export const protect = asyncHandler(async (req: AuthorizationRequest, res, next) => {
  let token: string;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return next(new ApiError(`You're not logged in, please login to continue`, 401));
  const decoded = jwt.verify(token, process.env.JWT_SECRET) as Decoded;
  if (!decoded) return next(new ApiError("Unauthorized", 401));
  const user = await prisma.user.findUnique({ where: { id: Number(decoded.id) } });
  if (!user || !user.isActive) return next(new ApiError("Unauthorized", 401));
  if ((parseInt(user.passChangedAt) / 1000, 10) > decoded.iat)
    return next(new ApiError("You changed your password recently, please login again", 403));
  req.user = user;
  next();
});
