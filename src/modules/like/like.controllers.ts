import asyncHandler from "express-async-handler";

import LikeServices from "./like.services";
import { AuthorizationRequest } from "./../../modules/auth/auth.interfaces";
import { LikeData } from "./like.interfaces";
import ApiError from "../../shared/utils/api.error";

class LikeControllers {
  private likeServices: LikeServices;
  constructor() {
    this.likeServices = new LikeServices();
  }
  /**
   *  @desc     Add or remove like on specific post
   *  @routes   Post /api/v1/posts/:postId/likes
   *  @access   Private (Users)
   */
  addOrRemoveLike = asyncHandler(async (req: AuthorizationRequest, res, next): Promise<void> => {
    const likeData: LikeData = {
      postId: Number(req.params.postId),
      userId: Number(req.user.id),
    };
    const result = await this.likeServices.addOrRemoveLike(likeData);
    if (!result) return next(new ApiError("Can not process your request", 500));
    res.status(200).json({ status: "success", data: result });
  });

  /**
   *  @desc     Get all likes for specific post
   *  @routes   Post /api/v1/posts/:postId/likes
   *  @access   Private (Users)
   */
  getAllLikes = asyncHandler(async (req, res, next): Promise<void> => {
    const postId = Number(req.params.postId);
    const likes = await this.likeServices.getAllLikes(postId);
    if (!likes) return next(new ApiError("Can not get likes on this post at this moment", 500));
    res.status(200).json({ status: "success", results: likes.length, data: likes });
  });
}

export default LikeControllers;