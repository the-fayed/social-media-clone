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
