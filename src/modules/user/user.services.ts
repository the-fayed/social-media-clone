import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import {
  CreateUserBody,
  GetUser,
  GetUserApiFeatures,
  IUser,
  UpdateLoggedUserPassword,
  UpdateSpecificUserData,
} from "./user.interfaces";
import ApiError from "../../shared/utils/api.error";
import cloudinary from "./../../config/cloudinary";
import ApiFeatures from "../../shared/utils/api.features/api.features";
import { ReqQuery } from "./../../shared/utils/api.features/api.features.interfaces";

const prisma = new PrismaClient();

class UserServices {
  // create new user
  async createUser(createUserBody: CreateUserBody): Promise<GetUser> {
    const { email, password, username, name, city, website, role } = createUserBody;
    let { avatar } = createUserBody;
    if (avatar) {
      const avatarResult = await cloudinary.uploader.upload(avatar, {
        folder: "uploads/user/avatar",
        format: "jpg",
        public_id: `${Date.now()}-avatar`,
      });
      avatar = avatarResult.url;
    }
    const user = (await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: bcrypt.hashSync(password, 12),
        name: name,
        role: role,
        profile: {
          create: {
            city: city,
            avatar: avatar,
            website: website,
          },
        },
      },
    })) as GetUser;
    if (!user) throw new ApiError("Error while creating user try again later", 400);
    return user;
  }
  // get all users
  async getAllUsers(): Promise<Array<GetUser>> {
    const users = (await prisma.user.findMany()) as Array<GetUser>;
    if (!users) throw new ApiError("No users where found", 404);
    return users;
  }
  // get single user by id
  async getSpecificUser(id: number): Promise<IUser> {
    const user = (await prisma.user.findUnique({
      where: { id: id },
      include: {
        profile: true,
        posts: true,
        comments: true,
        stories: true,
        likes: true,
        followers: true,
        following: true,
      },
    })) as IUser;
    if (!user) throw new ApiError(`Can't find a user with the ID of ${id}`, 503);
    return user;
  }
  // update specific user data
  async updateSpecificUserData(updateSpecificUserDataBody: UpdateSpecificUserData): Promise<GetUser> {
    const { id, email, name, city, website } = updateSpecificUserDataBody;
    let { avatar } = updateSpecificUserDataBody;
    if (avatar) {
      const avatarResult = await cloudinary.uploader.upload(avatar, {
        folder: "uploads/user/avatar",
        format: "jpg",
        public_id: `${Date.now()}-avatar`,
      });
      avatar = avatarResult.url;
    }
    const user = (await prisma.user.update({
      where: { id: id },
      data: {
        email: email || undefined,
        name: name,
        profile: {
          update: {
            city: city,
            avatar: avatar,
            website: website,
          },
        },
      },
      select: {
        name: true,
        email: true,
        id: true,
      },
    })) as GetUser;
    if (!user) throw new ApiError("The specified user does not exist", 404);
    return user;
  }
  // delete user
  async deleteSpecificUser(id: number): Promise<string> {
    const user = await prisma.user.update({ where: { id: id }, data: { isActive: false } });
    if (!user || !user.isActive) throw new ApiError("User not found!", 404);
    return "User has been deleted successfully";
  }
  // update logged user Password
  async updateLoggedUserPassword(updateLoggedUserPasswordBody: UpdateLoggedUserPassword): Promise<GetUser> {
    const { id, password } = updateLoggedUserPasswordBody;
    const user = (await prisma.user.update({
      where: { id: id },
      data: {
        password: bcrypt.hashSync(password, 12),
        passChangedAt: String(Date.now()),
      },
      select: {
        name: true,
        email: true,
        id: true,
      },
    })) as GetUser;
    if (!user) throw new ApiError("Error while updating password", 400);
    return user;
  }
  // search for users
  async searchForUsers(reqQuery: ReqQuery): Promise<GetUserApiFeatures> {
    const documentCount = await prisma.user.count({
      where: {
        OR: [
          { name: { contains: reqQuery.keyword } },
          { username: { contains: reqQuery.keyword } },
          { email: { contains: reqQuery.keyword } },
        ],
      },
    });
    const feature = new ApiFeatures(
      prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: reqQuery.keyword } },
            { username: { contains: reqQuery.keyword } },
            { email: { contains: reqQuery.keyword } },
          ],
        },
        select: { name: true, id: true, email: true, username: true },
      }),
      reqQuery
    ).paginate(documentCount);
    const { dbQuery, paginationResult } = feature;
    const users = (await dbQuery) as Array<GetUser>;
    return { paginationResult, users };
  }
}

export default UserServices;
