import { PrismaClient } from "@prisma/client";

import { LikeData, LikeSanitize } from "./like.interfaces";
import ApiError from "./../../utils/api.error";

const prisma = new PrismaClient();

class LikeServices {
  // like a post
  async addOrRemoveLike(likeData: LikeData): Promise<LikeSanitize | string> {
    const { postId, userId } = likeData;
    const isUserLikedPost = await prisma.like.findFirst({ where: { postId: postId, likeUserId: userId } });
    if (!isUserLikedPost) {
      const like = await prisma.like.create({
        data: { postId: postId, likeUserId: userId },
        select: { postId: true, likeUser: { select: { name: true, id: true } } },
      });
      if (!like) throw new ApiError("Error while adding like, please try again", 400);
      return like;
    }
    if (isUserLikedPost) {
      const like = await prisma.like.delete({ where: { id: isUserLikedPost.id, postId: postId, likeUserId: userId } });
      if (!like) throw new ApiError("Error while removing like, please try again", 400);
      return "like removed successfully";
    }
  }
  // get all likes on specific post
  async getAllLikes(postId: number): Promise<Array<LikeSanitize>> {
    const likes = (await prisma.like.findMany({
      where: { postId: postId },
      select: { postId: true, likeUser: { select: { name: true, id: true } } },
    })) as Array<LikeSanitize>;
    if (!likes) throw new ApiError("No likes on this post yet", 404);
    return likes;
  }
}

export default LikeServices;
