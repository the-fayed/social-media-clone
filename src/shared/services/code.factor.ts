import crypto from 'crypto';

export const generateEmailVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};