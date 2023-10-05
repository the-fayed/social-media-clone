import crypto from 'crypto';

import jwt from 'jsonwebtoken';

export const generateEmailVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const generatePasswordRestToken = (resetCode: string): string => {
  return crypto.createHash("sha256").update(resetCode).digest("hex");
}

export const generateAccessToken = (payload: number): string => {
  return jwt.sign({ id: payload }, process.env.JWT_SECRET as string, { expiresIn: process.env.EXPIRATION_PERIOD as string });
}