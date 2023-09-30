import { PrismaClient } from '@prisma/client';
import {Request, NextFunction} from 'express';

const prisma = new PrismaClient();

prisma.$use(async (params, next: NextFunction) => {
  if (params.args)
})
