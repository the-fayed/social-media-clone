import { PrismaClient } from "@prisma/client";

import { FollowOrUnFollowUserBody, GetLoggedUserFollowersApiFeature, GetLoggedUserFollowingsApiFeature, SanitizeFollowers, SanitizeFollowing } from "./relationship.interfaces";
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
    const { follower, following } = followOrUnFollowUserBody;
    const isFollowing = await this.prisma.relationship.findUnique({
      where: { followedUserId: following, followerId: follower },
    });
    if (isFollowing) {
      const unFollow = await this.prisma.relationship.delete({
        where: { id: isFollowing.id, followerId: follower, followedUserId: following },
        select: { followedUser: { select: { name: true } } },
      });
      if (!unFollow) throw new ApiError("You are not following this user", 400);
      return `You no longer following ${unFollow.followedUser.name}`;
    }
    if (!isFollowing) {
      const follow = await this.prisma.relationship.create({
        data: { followerId: follower, followedUserId: following },
        select: { followedUser: { select: { name: true } } },
      });
      if (!follow) throw new ApiError("can not process your request", 400);
      return `You are now following ${follow.followedUser.name}`;
    }
  }

  // Get logged user followers
  async getLoggedUserFollowers(userId: number, reqQuery: ReqQuery): Promise<GetLoggedUserFollowersApiFeature> {
    const documentCount = await this.prisma.relationship.count({ where: { followedUserId: userId } });
    const feature = new ApiFeatures(
      this.prisma.relationship.findMany({
        where: { followedUserId: userId },
        select: { id: true, followers: { select: { name: true, id: true } } },
      }),
      reqQuery
    ).paginate(documentCount);
    const { dbQuery, paginationResult } = feature;
    const followers = await dbQuery;
    if (!followers) throw new ApiError("You do not have any followers yet", 404);
    return { paginationResult, followers };
  }

  // get logged user following list
  async getLoggedUserFollowing(userId: number, reqQuery: ReqQuery): Promise<GetLoggedUserFollowingsApiFeature> {
    const documentCount = await this.prisma.relationship.count({ where: { followerId: userId } });
    const feature = new ApiFeatures(
      this.prisma.relationship.findMany({
        where: { followedUserId: userId },
        select: { id: true, followedUser: { select: { name: true, id: true } } },
      }),
      reqQuery
    ).paginate(documentCount);
    const { dbQuery, paginationResult } = feature;
    const following = await dbQuery;
    if (!following) throw new ApiError("You do not have follow any one yet", 404);
    return { paginationResult, following };
  }
}

export default RelationshipServices;
