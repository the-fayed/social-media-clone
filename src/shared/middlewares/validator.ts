import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validatorMiddleware = async(req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(409).json({errors: errors.array()});
  next();
}
