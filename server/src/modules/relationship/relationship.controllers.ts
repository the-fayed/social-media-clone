import asyncHandler from "express-async-handler";

import ApiError from "../../shared/utils/api.error";
import RelationshipServices from "./relationship.services";
import { AuthorizationRequest } from "./../../modules/auth/auth.interfaces";
import { FollowOrUnFollowUserBody } from "./relationship.interfaces";

class RelationshipControllers {
  private relationshipServices: RelationshipServices;
  constructor() {
    this.relationshipServices = new RelationshipServices();
  }

  /**
   *  @desc     Follow or un follow user
   *  @route    POST /api/v1/users/:userId/relationships
   *  @access   Private (User)
   */
  followOrUnFollowUser = asyncHandler(async (req: AuthorizationRequest, res, next): Promise<void> => {
    const followOrUnFollowUserBody: FollowOrUnFollowUserBody = {
      follower: Number(req.user.id),
      following: Number(req.params.userId),
    };
    const result = await this.relationshipServices.followOrUnFollowUser(followOrUnFollowUserBody);
    if (!result) return next(new ApiError("You can not follow or un follow this user at the moment", 500));
    res.status(200).json({ status: "success", message: result });
  });

  /**
   *  @desc     Get logged user followers
   *  @route    GET /api/v1/relationships/loggedUser/followers
   *  @access   Private (User)
   */
  getLoggedUserFollowers = asyncHandler(async (req: AuthorizationRequest, res, next): Promise<void> => {
    const userId = Number(req.user.id);
    const results = await this.relationshipServices.getLoggedUserFollowers(userId, req.query);
    if (!results) return next(new ApiError("Can not get your followers list at the moment", 500));
    res.status(200).json({ status: "success", paginationResult: results.paginationResult, data: results.followers });
  });

  /**
   *  @desc     Get logged user following list
   *  @route    GET /api/v1/relationships/loggedUser/following
   *  @access   Private (User)
   */
  getLoggedUserFollowing = asyncHandler(async (req: AuthorizationRequest, res, next): Promise<void> => {
    const userId = Number(req.user.id);
    const results = await this.relationshipServices.getLoggedUserFollowing(userId, req.query);
    if (!results) return next(new ApiError("Can not get your followers list at the moment", 500));
    res.status(200).json({ status: "success", paginationResult: results.paginationResult, data: results.following });
  });
}

export default RelationshipControllers;
