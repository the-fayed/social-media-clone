import { Request } from 'express';
import { User } from './../user/user.interfaces';

export interface loginBody {
  email: string;
  password: string;
};

export interface signupBody extends loginBody {
  name: string,
  username: string,
  avatar?: string,
  cover?: string,
  city: string,
  website?: string
}

export interface decoded {
  id: number
  role?: string,
  iat: number
}

export interface AuthorizationRequest extends Request {
  user?: User
}