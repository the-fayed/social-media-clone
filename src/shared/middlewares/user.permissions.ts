import asyncHandler from 'express-async-handler';
import { AuthorizationRequest } from '../../modules/auth/auth.interfaces';
import ApiError from './../../utils/api.error';

export const allowTo = (... roles : Array<string>) => {
  return asyncHandler(async (req: AuthorizationRequest, res, next) => {
    if (!roles.includes(req.user.role)) return next(new ApiError('Unauthorized', 401));
    next();
  })
}