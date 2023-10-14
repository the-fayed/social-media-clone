import { Router } from "express";

import StoryControllers from "./story.controllers";
import { protect } from "./../../shared/middlewares/protection";
import { allowTo } from "./../../shared/middlewares/user.permissions";
import { uploadSingleImage } from "./../../shared/middlewares/multer";
import {
  createStoryValidator,
  deleteStoryValidator,
  getSpecificStoryValidator,
  updateStoryPrivacyValidator,
} from "./story.validator";

const router = Router();
const storyControllers = new StoryControllers();

router.use(protect, allowTo(["User"]));

router.get("/loggedUser", storyControllers.getLoggedUserStories);

router
  .route("/")
  .post(uploadSingleImage("image"), storyControllers.createNewStory)
  .get(storyControllers.getAllStories);

router
  .route("/:id")
  .get(getSpecificStoryValidator, storyControllers.getSpecificStory)
  .put(updateStoryPrivacyValidator, storyControllers.updateStoryPrivacy)
  .delete(deleteStoryValidator, storyControllers.deleteSpecificStory);

export default router;
