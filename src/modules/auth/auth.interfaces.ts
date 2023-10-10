import { Request } from "express";
import { IUser } from "./../user/user.interfaces";

export interface LoginBody {
  email: string;
  password: string;
}

export interface LoginSanitize {
  id: number;
  name: string;
  email: string;
}

export interface SignupSanitize extends LoginSanitize {
  emailVerificationToken?: string;
  profile?: object;
}

export interface ILogin extends LoginSanitize {
  password: string;
  emailVerified: boolean;
  emailVerificationToken?: string;
}

export interface SignupBody extends LoginBody {
  name: string;
  username: string;
  avatar?: string | undefined;
  city: string;
  website?: string;
}

export interface Decoded {
  id: number;
  role?: string;
  iat: number;
}

export interface AuthorizationRequest extends Request {
  user?: IUser;
}

