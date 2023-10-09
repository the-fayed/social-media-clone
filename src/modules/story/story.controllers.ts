import asyncHandler from "express-async-handler";

import StoryServices from "./story.services";
import { AuthorizationRequest } from "./../../modules/auth/auth.interfaces";
import { CreateStoryBody, DeleteStoryBody, UpdateStoryPrivacyBody } from "./story.interfaces";
import ApiError from "../../shared/utils/api.error";

class StoryControllers {
  private storyServices: StoryServices;
  constructor() {
    this.storyServices = new StoryServices();
  }

  /**
   *  @desc     Create new Story
   *  @route    POST /api/v1/stories
   *  @access   Private (User)
   */
  createNewStory = asyncHandler(async (req: AuthorizationRequest, res, next): Promise<void> => {
    const createStoryBody: CreateStoryBody = {
      storyAuthorId: Number(req.user.id),
      image: req.file?.path,
      privacy: req.body.privacy,
    };
    const story = await this.storyServices.createNewStory(createStoryBody);
    if (!story) return next(new ApiError("Can not create a story at the time", 500));
    res.status(201).json({ status: "success", data: story });
  });

  /**
   *  @desc     Get logged user stories
   *  @route    GET /api/v1/stories/loggedUser
   *  @access   Private (User)
   */
  getLoggedUserStories = asyncHandler(async (req: AuthorizationRequest, res, next): Promise<void> => {
    const loggedUserId = Number(req.user?.id);
    const stories = await this.storyServices.getLoggedUserStories(loggedUserId);
    if (!stories) return next(new ApiError("Error while getting stories", 500));
    res.status(200).json({ status: "success", data: stories });
  });

  /**
   *  @desc     Get all stories
   *  @route    GET /api/v1/stories
   *  @access   Private (User)
   */
  getAllStories = asyncHandler(async (req: AuthorizationRequest, res, next): Promise<void> => {
    const userId = Number(req.user.id);
    const stories = await this.storyServices.getAllStories(userId);
    if (!stories) return next(new ApiError("Can not get stories at the moment", 500));
    res.status(200).json({ status: "success", data: stories });
  });

  /**
   *  @desc     Get specific story
   *  @route    GET /api/v1/stories/:id
   *  @access   Private (User)
   */
  getSpecificStory = asyncHandler(async (req: AuthorizationRequest, res, next): Promise<void> => {
    const [storyId, loggedUserId] = [Number(req.params.id), Number(req.user?.id)];
    const story = await this.storyServices.getSpecificStory(storyId, loggedUserId);
    if (!story) return next(new ApiError("Can not get story at the moment", 500));
    res.status(200).json({ status: "success", data: story });
  });

  /**
   *  @desc     Update specific story privacy
   *  @route    PUT /api/v1/stories/:id
   *  @access   Private (User)
   */
  updateStoryPrivacy = asyncHandler(async (req: AuthorizationRequest, res, next): Promise<void> => {
    const updateStoryPrivacyBody: UpdateStoryPrivacyBody = {
      storyId: Number(req.params.id),
      storyAuthorId: Number(req.user.id),
      privacy: req.body.privacy,
    };
    const story = await this.storyServices.updateStoryPrivacy(updateStoryPrivacyBody);
    if (!story) return next(new ApiError("Error while updating story", 500));
    res.status(200).json({ status: "success", data: story });
  });

  /**
   *  @desc     Delete specific story
   *  @route    DELETE /api/v1/stories/:id
   *  @access   Private (User)
   */
  deleteSpecificStory = asyncHandler(async (req: AuthorizationRequest, res, next): Promise<void> => {
    const deleteStoryBody: DeleteStoryBody = {
      storyAuthorId: Number(req.user.id),
      storyId: Number(req.params.id),
    };
    const result = await this.storyServices.deleteSpecificStory(deleteStoryBody);
    if (!result) return next(new ApiError("Error while deleting story", 500));
    res.status(200).json({ status: "success", message: result });
  });
}

export default StoryControllers;
