import asyncHandler from "express-async-handler";

import AuthService from "./auth.services";
import ApiError from "./../../utils/api.error";
import { LoginBody, LoginSanitize, SignupBody } from "./auth.interfaces";
import { generateAccessToken } from "./../../shared/services/code.factor";

class AuthController {
  private authService: AuthService;
  constructor() {
    this.authService = new AuthService();
  }
  /**
   *  @desc     Sign up
   *  @route    POST /api/v1/auth/signup
   *  @access   Public
   */

  signup = asyncHandler(async (req, res, next): Promise<void> => {
    const signupBody: SignupBody = {
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      avatar: req.body.avatar,
      cover: req.body.cover,
      city: req.body.city,
      website: req.body.website,
    };
    const result: string = await this.authService.signup(signupBody);
    if (!result) return next(new ApiError("Error while creating an account, please try again later", 400));
    res.status(201).json({ status: "success", message: result });
  });

  /**
   *  @desc     Login
   *  @route    POST /api/v1/auth/login
   *  @access   Public
   */
  login = asyncHandler(async (req, res, next): Promise<void> => {
    const loginBody: LoginBody = {
      email: req.body.email,
      password: req.body.password,
    };
    const result: string | LoginSanitize = await this.authService.login(loginBody);
    if (!result || typeof result === "string") {
      return next(new ApiError(typeof result === "string" ? result : `Invalid credentials`, 403));
    }
    const accessToken = generateAccessToken(result.id);
    res.status(200).json({ status: "success", data: result, accessToken });
  });

  /**
   *  @desc     Verify email token
   *  @route    GET /api/v1/auth/verify/email/:token
   *  @access   Public
   */
  verifyEmailToken = asyncHandler(async (req, res, next): Promise<void> => {
    const token: string = req.params.token;
    const result: string = await this.authService.verifyEmailToken(token);
    if (!result) return next(new ApiError("Error while verifying you email, try again later", 403));
    res.status(200).json({ status: "success", data: result });
  });

  /**
   *  @desc     Forgot password
   *  @route    POST /api/v1/auth/forgotPassword
   *  @access   Public
   */
  forgotPassword = asyncHandler(async (req, res, next): Promise<void> => {
    const email: string = req.body.email;
    const result = await this.authService.forgotPassword(email);
    if (!result) return next(new ApiError("Can not reset your password at this time", 400));
    res.status(200).json({ status: "success", message: result });
  });

  /**
   *  @desc     Verify password reset code
   *  @route    POST /api/v1/auth/verify/passwordResetCode
   *  @access   Public
   */
  verifyPasswordResetCode = asyncHandler(async (req, res, next): Promise<void> => {
    const resetCode: string = req.body.resetCode;
    const result = await this.authService.verifyPasswordResetToken(resetCode);
    if (!result) return next(new ApiError("Can not verify your password reset token, please try again later", 400));
    res.status(200).json({ status: "success", message: result });
  });

  /**
   *  @desc     Reset password
   *  @route    POST /api/v1/auth/resetPassword
   *  @access   Public
   */
  resetPassword = asyncHandler(async (req, res, next): Promise<void> => {
    const { email, password }: LoginBody = req.body;
    const user = await this.authService.resetPassword(email, password);
    if (!user) return next(new ApiError("Can not reset your password at the moment, please try again later", 400));
    const accessToken = generateAccessToken(user?.id);
    res.status(200).json({ status: "success", data: user, accessToken });
  });
}

export default AuthController;
