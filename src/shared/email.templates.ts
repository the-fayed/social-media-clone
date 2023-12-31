export const verifyEmail = (token: string): string => {
  return `
  <h1>Emil verification</h1>
  <p>Thanks for signing up! Please verify your account by clicking the link below:</p>
  <p><a href="${process.env.BASEURL}/api/v1/auth/verify/email/${token}">Verify</a></p>
  `;
};

export const passwordResetCode = (code: string): string => {
  return `
  <h1>Reset Password</h1>
  <p>your reset password code is ${code}.</p>
  <p>If you did not request a password reset, please ignore this email.</p>
  `;
};
