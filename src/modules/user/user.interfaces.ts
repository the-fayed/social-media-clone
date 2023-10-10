import { Roles } from '@prisma/client';

export interface IUser {
  name: string;
  username: string;
  email: string;
  password: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  role: string;
  emailVerified: boolean;
  emailVerificationToken?: string;
  passResetToken?: string;
  passResetTokenExpire?: string;
  passResetCodeVerified?: boolean;
  passChangedAt?: string;
  profile?: object;
  posts?: Array<object>;
  comments?: Array<object>;
  likes?: Array<object>;
  stories?: Array<object>;
  followers?: Array<object>;
  following?: Array<object>;
}

export interface CreateUserBody {
  name: string;
  username: string;
  email: string;
  password: string;
  role: Roles;
  city: string;
  avatar?: string;
  cover?: string;
  website?: string;
}

export interface UpdateSpecificUserData {
  id: number;
  name?: string;
  email?: string;
  city?: string;
  cover?: string;
  avatar?: string;
  website?: string;
}

export interface GetUser {
  id: number;
  name: string;
  email?: string;
}

export interface UpdateLoggedUserPassword {
  id: number;
  password: string;
}

export interface GetUserApiFeatures {
  users: Array<GetUser>;
  paginationResult: {
    limit: number;
    currentPage: number;
    documentCount: number;
    nextPage?: number;
    previousPage?: number;
  };
}