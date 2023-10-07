import { check } from 'express-validator';
import { PrismaClient } from '@prisma/client';

import { validatorMiddleware } from './../../shared/middlewares/validator';

const prisma = new PrismaClient();

export const followOrUnFollowUserValidator = [
  check('userId').notEmpty().withMessage('User id is required').isNumeric().withMessage('Invalid user id').custom(async (value: string) => {
    const user = await prisma.user.findUnique({where: {id: Number(value)}});
    if (!user) throw new Error('User you want to follow not found');
  }),
  validatorMiddleware
]