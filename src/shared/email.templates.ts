export const verifyEmail = (token: string): string => {
  return `
  <h1>Emil verification</h1>
  <p>Thanks for signing up! Please verify your account by clicking the link below:</p>
  <p><a href="${process.env.BASEURL}/api/v1/auth/verify/email/${token}">Verify</a></p>
  `;
};
