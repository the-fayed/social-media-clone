import { PrismaClient } from "@prisma/client";

import {
  FollowOrUnFollowUserBody,
  GetLoggedUserFollowersApiFeature,
  GetLoggedUserFollowingsApiFeature,
} from "./relationship.interfaces";
import ApiError from "../../shared/utils/api.error";
import { ReqQuery } from "./../../shared/utils/api.features/api.features.interfaces";
import ApiFeatures from "./../../shared/utils/api.features/api.features";

class RelationshipServices {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }
  // follow or un follow user
  async followOrUnFollowUser(followOrUnFollowUserBody: FollowOrUnFollowUserBody): Promise<string> {
    const { followerId, followingId } = followOrUnFollowUserBody;
    const isFollowing = await this.prisma.relationship.findFirst({
      where: { followedId: followingId, followerId: followerId },
    });
    if (!isFollowing) {
      const relationship = await this.prisma.relationship.create({
        data: {
          followedId: followingId,
          followerId: followerId,
        },
        include: { followed: { select: { name: true } } },
      });
      return `You are now following ${relationship.followed.name}`;
    }
    if (isFollowing) {
      const relationship = await this.prisma.relationship.delete({
        where: { id: isFollowing.id },
        include: { followed: { select: { name: true } } },
      });
      return `You no longer following ${relationship.followed.name}`;
    }
  }

  // Get logged user followers
  async getLoggedUserFollowers(userId: number, reqQuery: ReqQuery): Promise<GetLoggedUserFollowersApiFeature> {
    const documentCount = await this.prisma.relationship.count({ where: { followedId: userId } });
    const feature = new ApiFeatures(
      this.prisma.relationship.findMany({
        where: { followedId: userId },
        select: { id: true, follower: { select: { name: true, id: true } } },
      }),
      reqQuery
    ).paginate(documentCount);
    const { dbQuery, paginationResult } = feature;
    const followers = await dbQuery;
    if (!followers || !followers.length) throw new ApiError("You do not have any followers yet", 404);
    return { paginationResult, followers };
  }

  // get logged user following list
  async getLoggedUserFollowing(userId: number, reqQuery: ReqQuery): Promise<GetLoggedUserFollowingsApiFeature> {
    const documentCount = await this.prisma.relationship.count({ where: { followerId: userId } });
    const feature = new ApiFeatures(
      this.prisma.relationship.findMany({
        where: { followerId: userId },
        select: { id: true, followed: { select: { name: true, id: true } } },
      }),
      reqQuery
    ).paginate(documentCount);
    const { dbQuery, paginationResult } = feature;
    const following = await dbQuery;
    if (!following || !following.length) throw new ApiError("You do not have follow any one yet", 404);
    return { paginationResult, following };
  }
}

export default RelationshipServices;
