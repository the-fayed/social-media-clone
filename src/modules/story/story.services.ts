import { PrismaClient } from "@prisma/client";

import SanitizeData from "../../shared/utils/sanitize.data";
import { CreateStoryBody, DeleteStoryBody, StorySanitize, UpdateStoryPrivacyBody } from "./story.interfaces";
import cloudinary from "./../../config/cloudinary";
import ApiError from "../../shared/utils/api.error";

const prisma = new PrismaClient();

class StoryServices {
  private sanitizeData: SanitizeData;
  constructor() {
    this.sanitizeData = new SanitizeData();
  }
  // create new story
  async createNewStory(createStoryBody: CreateStoryBody): Promise<StorySanitize> {
    const { storyAuthorId, privacy } = createStoryBody;
    let { image } = createStoryBody;
    if (image) {
      const imageResult = await cloudinary.uploader.upload(image, {
        folder: `uploads/stories`,
        format: "jpg",
        public_id: `${Date.now()}-story`,
      });
      image = imageResult.url;
    }
    const story = (await prisma.story.create({
      data: { image: image, storyAuthorId: storyAuthorId, privacy: privacy ? privacy : undefined },
      include: { storyAuthor: { select: { name: true, id: true } } },
    })) as StorySanitize;
    if (!story) throw new ApiError("Error while creating story", 400);
    return this.sanitizeData.story(story);
  }
  // get all stories
  async getAllStories(loggedUserId: number): Promise<Array<StorySanitize>> {
    const followingList = await prisma.relationship.findMany({ where: { followerId: loggedUserId } });
    let followingListIds: Array<number>;
    followingListIds = followingList?.map((item) => item.followedUserId) ?? [];
    const stories = (await prisma.story.findMany({
      where: {
        OR: [
          { storyAuthorId: { in: followingListIds }, privacy: { in: ["followers", "public"] } },
          {
            privacy: "public",
          },
        ],
      },
      include: { storyAuthor: { select: { name: true, id: true } } },
    })) as Array<StorySanitize>;
    if (!stories || !stories.length) throw new ApiError("No stories to show", 404);
    return stories;
  }
  // Get specific story
  async getSpecificStory(id: number, loggedUserId: number): Promise<StorySanitize> {
    const followingList = await prisma.relationship.findMany({ where: { followerId: loggedUserId } });
    let followingListIds: Array<number>;
    followingListIds = followingList?.map((item) => item.followedUserId) ?? [];
    const story = (await prisma.story.findFirst({
      where: {
        OR: [
          { id: id, storyAuthorId: { in: followingListIds }, privacy: { in: ["followers", "public"] } },
          {
            id: id,
            privacy: "public",
          },
        ],
      },
      include: { storyAuthor: { select: { name: true, id: true } } },
    })) as StorySanitize;
    if (!story) throw new ApiError("Story not found", 404);
    return this.sanitizeData.story(story);
  }
  // Get logged user stories
  async getLoggedUserStories(loggedUserId: number): Promise<Array<StorySanitize>> {
    const stories = (await prisma.story.findMany({
      where: { storyAuthorId: loggedUserId },
      include: { storyAuthor: { select: { name: true, id: true } } },
    })) as Array<StorySanitize>;
    if (!stories || !stories.length) throw new ApiError("No stories to show", 404);
    return stories;
  }
  // Update story privacy
  async updateStoryPrivacy(updateStoryPrivacyBody: UpdateStoryPrivacyBody): Promise<StorySanitize> {
    const { storyId, storyAuthorId, privacy } = updateStoryPrivacyBody;
    const story = (await prisma.story.update({
      where: { id: storyId, storyAuthorId: storyAuthorId },
      data: { privacy: privacy ? privacy : undefined },
      include: { storyAuthor: { select: { name: true, id: true } } },
    })) as StorySanitize;
    if (!story) throw new ApiError("Error while updating, please try again", 400);
    return this.sanitizeData.story(story);
  }
  // Delete story
  async deleteSpecificStory(deleteStoryBody: DeleteStoryBody): Promise<string> {
    const { storyId, storyAuthorId } = deleteStoryBody;
    const story = await prisma.story.delete({ where: { id: storyId, storyAuthorId: storyAuthorId } });
    if (!story) throw new ApiError("Story not found", 404);
    return "Story deleted successfully";
  }
}

export default StoryServices;
