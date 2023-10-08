import { PrismaClient } from "@prisma/client";

import SanitizeData from "../../utils/sanitize.data";
import { CreatePostBody, GetAllPostsBody, PostSanitize, UpdatePostBody, getSpecificPostBody } from "./post.interfaces";
import ApiError from "./../../utils/api.error";
import cloudinary from "./../../config/cloudinary";

const prisma = new PrismaClient();

class PostServices {
  private sanitizeData: SanitizeData;
  constructor() {
    this.sanitizeData = new SanitizeData();
  }
  // create post
  async createNewPost(createPostBody: CreatePostBody): Promise<PostSanitize> {
    const { postAuthorId, desc, privacy } = createPostBody;
    let { image } = createPostBody;
    if (image) {
      const imageResult = await cloudinary.uploader.upload(image, {
        folder: "uploads/posts",
        format: "jpg",
        public_id: `${Date.now()}-post`,
      });
      image = imageResult.url;
    }
    const post = (await prisma.post.create({
      data: {
        postAuthorId: postAuthorId,
        desc: desc,
        image: image,
        privacy: privacy,
      },
      include: {
        postAuthor: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    })) as PostSanitize;
    if (!post) throw new ApiError("Error while creating your post, please try again later", 400);
    return this.sanitizeData.post(post);
  }
  // update post
  async updateSpecificPost(updatePostBody: UpdatePostBody): Promise<PostSanitize> {
    const { postAuthorId, id, desc, privacy } = updatePostBody;
    let { image } = updatePostBody;
    if (image) {
      const imageResult = await cloudinary.uploader.upload(image, {
        folder: "uploads/posts",
        format: "jpg",
        public_id: `${Date.now()}-post`,
      });
      image = imageResult.url;
    }
    const post = (await prisma.post.update({
      where: { postAuthorId: postAuthorId, id: id },
      data: {
        desc: desc ? desc : undefined,
        image: image ? image : undefined,
        privacy: privacy ? privacy : undefined,
      },
      include: {
        postAuthor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })) as PostSanitize;
    if (!post) throw new ApiError("Error while updating post, please try again", 400);
    return this.sanitizeData.post(post);
  }
  // get all posts
  async getAllPosts(getAllPostsBody: GetAllPostsBody): Promise<Array<PostSanitize>> {
    const {authorId, loggedUserId} = getAllPostsBody;
    let filter = {};
    if (authorId) {
      filter = { postAuthorId: authorId };
    }
    const followingList = await prisma.relationship.findMany({ where: { followerId: loggedUserId } });
    let followingListIds: Array<number>;
    followingListIds = followingList?.map((item) => item.followedUserId) ?? [];
    const posts = (await prisma.post.findMany({
      where: {
        OR: [
          { ...filter, privacy: "public" },
          { ...filter, postAuthorId: { in: followingListIds }, privacy: { in: ["followers", "public"] } },
        ],
      },
      include: {
        postAuthor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })) as Array<PostSanitize>;
    if (!posts) throw new ApiError("Not posts found", 404);
    return posts;
  }
  // get specific post
  async getSpecificPost(getSpecificPostBody: getSpecificPostBody): Promise<PostSanitize> {
    const { postId, loggedUserId } = getSpecificPostBody;
    const followingList = await prisma.relationship.findMany({ where: { followerId: loggedUserId } });
    let followingListIds: Array<number>;
    followingListIds = followingList?.map((item) => item.followedUserId) ?? [];
    const post = (await prisma.post.findFirst({
      where: {
        OR: [
          { id: postId, privacy: "public" },
          { id: postId, privacy: { in: ["public", "followers"] }, postAuthorId: { in: followingListIds } },
        ],
      },
      include: {
        postAuthor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })) as PostSanitize;
    if (!post) throw new ApiError("Post not found", 404);
    return this.sanitizeData.post(post);
  }
  // get logged user posts
  async getLoggedUserPosts (loggedUserId: number): Promise<Array<PostSanitize>> {
    const posts = (await prisma.post.findMany({
      where: { postAuthorId: loggedUserId },
      include: { postAuthor: { select: { name: true, id: true } } },
    })) as Array<PostSanitize>;
    if (!posts || !posts.length) throw new ApiError('No posts found', 404);
    return posts;
  }
  // delete specific post
  async deleteSpecificPost(id: number, authorId: number): Promise<string> {
    const post = await prisma.post.delete({ where: { id: id, postAuthorId: authorId } });
    if (!post) throw new ApiError("Post not found", 404);
    await prisma.$transaction([
      prisma.comment.deleteMany({ where: { postId: id } }),
      prisma.like.deleteMany({ where: { postId: id } }),
    ]);
    return "Post deleted successfully";
  }
}

export default PostServices;
