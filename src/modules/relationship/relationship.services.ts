import { PrismaClient } from "@prisma/client";

import { FollowOrUnFollowUserBody, SanitizeFollowers, SanitizeFollowing } from "./relationship.interfaces";
import ApiError from "./../../utils/api.error";

const prisma = new PrismaClient();

class RelationshipServices {
  // follow or un follow user
  async followOrUnFollowUser(followOrUnFollowUserBody: FollowOrUnFollowUserBody): Promise<string> {
    const { follower, following } = followOrUnFollowUserBody;
    const isFollowing = await prisma.relationship.findUnique({
      where: { followedUserId: following, followerId: follower },
    });
    if (isFollowing) {
      const unFollow = await prisma.relationship.delete({
        where: { id: isFollowing.id, followerId: follower, followedUserId: following },
        select: { followedUser: { select: { name: true } } },
      });
      if (!unFollow) throw new ApiError("You are not following this user", 400);
      return `You no longer following ${unFollow.followedUser.name}`;
    }
    if (!isFollowing) {
      const follow = await prisma.relationship.create({
        data: { followerId: follower, followedUserId: following },
        select: { followedUser: { select: { name: true } } },
      });
      if (!follow) throw new ApiError("can not process your request", 400);
      return `You are now following ${follow.followedUser.name}`;
    }
  }

  // Get logged user followers
  async getLoggedUserFollowers(userId: number): Promise<Array<SanitizeFollowers>> {
    const followers = (await prisma.relationship.findMany({
      where: { followedUserId: userId },
      select: { id: true, followers: { select: { name: true, id: true } } },
    })) as Array<SanitizeFollowers>;
    if (!followers) throw new ApiError("You do not have any followers yet", 404);
    return followers;
  }

  // get logged user following list
  async getLoggedUserFollowing(userId: number): Promise<Array<SanitizeFollowing>> {
    const following = (await prisma.relationship.findMany({
      where: { followerId: userId },
      select: { id: true, followedUser: { select: { name: true, id: true } } },
    })) as Array<SanitizeFollowing>;
    if (!following) throw new ApiError('You have not followed any one yet', 404);
    return following;
  };
}

export default RelationshipServices;
