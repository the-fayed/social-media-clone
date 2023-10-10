import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import SanitizeData from "../../shared/utils/sanitize.data";
import { ILogin, LoginBody, LoginSanitize, SignupBody, SignupSanitize } from "./auth.interfaces";
import ApiError from "../../shared/utils/api.error";
import { sendEmail } from "./../../shared/services/send.email";
import { passwordResetCode, verifyEmail } from "./../../shared/email.templates";
import { generateEmailVerificationToken, generatePasswordRestToken } from "./../../shared/services/code.factor";
import cloudinary from "./../../config/cloudinary";

class AuthService {
  private sanitizeData: SanitizeData;
  private prisma: PrismaClient;
  constructor() {
    this.sanitizeData = new SanitizeData();
    this.prisma = new PrismaClient();
  }
  // sign up
  signup = async (signupBody: SignupBody): Promise<string> => {
    const { email, name, username, password, city } = signupBody;
    let { avatar } = signupBody;
    if (avatar) {
      const avatarResult = await cloudinary.uploader.upload(avatar, {
        folder: "uploads/user/avatar",
        format: "jpg",
        public_id: `${Date.now()}-avatar`,
      });
      avatar = avatarResult.url;
    }
    const user = (await this.prisma.user.create({
      data: {
        name: name,
        email: email,
        username: username,
        password: bcrypt.hashSync(password, 12),
        emailVerificationToken: generateEmailVerificationToken(),
        profile: {
          create: {
            city: city,
            avatar: avatar,
          },
        },
      },
    })) as SignupSanitize;
    if (!user) throw new ApiError("Error while sign up, please try again", 400);
    await sendEmail(user.email, "Email Verification", verifyEmail(user.emailVerificationToken));
    return "A verification email has been sent to your email address, please verify your email to login";
  };
  // log in
  login = async (loginBody: LoginBody): Promise<string | LoginSanitize> => {
    try {
      const { email, password } = loginBody;
      const user = (await this.prisma.user.findUnique({ where: { email: email } })) as ILogin;
      if (!user || !bcrypt.compareSync(password, user.password)) throw new ApiError("Invalid email or password", 401);
      if (!user.emailVerified) {
        if (user.emailVerificationToken) {
          await sendEmail(user.email, "Email Verification", verifyEmail(user.emailVerificationToken));
          return "Your email address not verified yet, please verify your email";
        }
        if (!user.emailVerificationToken) {
          const updated = await this.prisma.user.update({
            where: { email: user.email },
            data: {
              emailVerificationToken: generateEmailVerificationToken(),
            },
          });
          await sendEmail(user.email, "Email Verification", verifyEmail(updated.emailVerificationToken));
          return "Your email address not verified yet, please verify your email";
        }
      } else {
        return this.sanitizeData.userLogin(user);
      }
    } catch (error) {
      throw error;
    }
  };
  // verify email token
  verifyEmailToken = async (token: string): Promise<string> => {
    try {
      const user = (await this.prisma.user.update({
        where: { emailVerificationToken: token },
        data: {
          emailVerified: true,
          emailVerificationToken: null,
        },
      })) as ILogin;
      if (!user) throw new ApiError("Invalid or expired token", 409);
      return "Email verified successfully";
    } catch (error) {
      throw error;
    }
  };
  // forgot password
  forgotPassword = async (email: string): Promise<string> => {
    try {
      const user = await this.prisma.user.findUnique({ where: { email: email } });
      if (!user) throw new ApiError("user not found", 404);
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      await this.prisma.user.update({
        where: { id: user?.id },
        data: {
          passResetToken: generatePasswordRestToken(resetCode),
          passResetTokenExpire: String(Date.now() + 10 * 60 * 1000),
        },
      });
      await sendEmail(user?.email, "Password Reset Code", passwordResetCode(resetCode));
      return "Reset code has been sent to your email";
    } catch (error) {
      throw error;
    }
  };
  // verify password reset token
  verifyPasswordResetToken = async (code: string): Promise<string> => {
    try {
      const user = await this.prisma.user.findFirst({ where: { passResetToken: generatePasswordRestToken(code) } });
      if (!user || Number(user.passResetTokenExpire) < Date.now())
        throw new ApiError("Invalid or expired reset code", 409);
      await this.prisma.user.update({
        where: { id: user?.id },
        data: {
          passResetCodeVerified: true,
          passResetToken: null,
          passResetTokenExpire: null,
        },
      });
      return `Password reset code has been verified successfully!`;
    } catch (error) {
      throw error;
    }
  };
  // reset password
  resetPassword = async (email: string, password: string): Promise<LoginSanitize> => {
    try {
      const user = await this.prisma.user.findUnique({ where: { email: email } });
      if (!user) throw new ApiError("user not found", 404);
      if (!user?.passResetCodeVerified) throw new ApiError("Password reset code has not been verified yet", 409);
      const updated = await this.prisma.user.update({
        where: { id: user?.id },
        data: {
          password: bcrypt.hashSync(password, 12),
          passChangedAt: String(Date.now()),
          passResetCodeVerified: null,
        },
      });
      return this.sanitizeData.userLogin(updated);
    } catch (error) {
      throw error;
    }
  };
}

export default AuthService;
