import { PrismaClient } from "@prisma/client";

import SanitizeData from "../../shared/utils/sanitize.data";
import {
  CreatePostBody,
  GetAllPostsBody,
  PostSanitize,
  UpdatePostBody,
  GetSpecificPostBody,
  GetPostsApiFeatures,
} from "./post.interfaces";
import ApiError from "../../shared/utils/api.error";
import cloudinary from "./../../config/cloudinary";
import ApiFeatures from "../../shared/utils/api.features/api.features";
import { ReqQuery } from './../../shared/utils/api.features/api.features.interfaces';

class PostServices {
  private sanitizeData: SanitizeData;
  private prisma: PrismaClient;
  constructor() {
    this.sanitizeData = new SanitizeData();
    this.prisma = new PrismaClient();
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
    const post = (await this.prisma.post.create({
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
    const post = (await this.prisma.post.update({
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
  async getAllPosts(getAllPostsBody: GetAllPostsBody): Promise<GetPostsApiFeatures> {
    const { authorId, loggedUserId, reqQuery } = getAllPostsBody;
    let filter = {};
    if (authorId) {
      filter = { postAuthorId: authorId };
    }
    const followingList = await this.prisma.relationship.findMany({ where: { followerId: loggedUserId } });
    let followingListIds: Array<number>;
    followingListIds = followingList?.map((item) => item.followedUserId) ?? [];
    const documentCount = await this.prisma.post.count({
      where: {
        OR: [
          { ...filter, privacy: "public" },
          { ...filter, postAuthorId: { in: followingListIds }, privacy: { in: ["followers", "public"] } },
        ],
        postAuthorId: { not: loggedUserId },
      },
    });
    const feature = new ApiFeatures(
      this.prisma.post.findMany({
        where: {
          OR: [
            { ...filter, privacy: "public" },
            { ...filter, postAuthorId: { in: followingListIds }, privacy: { in: ["followers", "public"] } },
          ],
          postAuthorId: { not: loggedUserId },
        },
        include: {
          postAuthor: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      reqQuery
    ).paginate(documentCount);
    const { dbQuery, paginationResult } = feature;
    const posts = (await dbQuery) as Array<PostSanitize>;
    if (!posts || !posts.length) throw new ApiError("Not posts found", 404);
    for (let post in posts) {
      const comments = await this.prisma.comment.count({ where: { postId: posts[post].id } });
      const likes = await this.prisma.like.count({ where: { postId: posts[post].id } });
      posts[post].totalComments = comments;
      posts[post].totalLikes = likes;
    }
    return { paginationResult, posts };
  }
  // get specific post
  async getSpecificPost(getSpecificPostBody: GetSpecificPostBody): Promise<PostSanitize> {
    const { postId, loggedUserId } = getSpecificPostBody;
    const followingList = await this.prisma.relationship.findMany({ where: { followerId: loggedUserId } });
    let followingListIds: Array<number>;
    followingListIds = followingList?.map((item) => item.followedUserId) ?? [];
    const post = (await this.prisma.post.findFirst({
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
  async getLoggedUserPosts(loggedUserId: number, reqQuery: ReqQuery): Promise<GetPostsApiFeatures> {
    const feature = new ApiFeatures(
      this.prisma.post.findMany({
        where: { postAuthorId: loggedUserId },
        include: { postAuthor: { select: { name: true, id: true } } },
      }),
      reqQuery
    );
    const { dbQuery, paginationResult } = feature;
    const posts = await dbQuery;
    if (!posts || !posts.length) throw new ApiError("No posts found", 404);
    return { paginationResult, posts };
  }
  // delete specific post
  async deleteSpecificPost(id: number, authorId: number): Promise<string> {
    const post = await this.prisma.post.delete({ where: { id: id, postAuthorId: authorId } });
    if (!post) throw new ApiError("Post not found", 404);
    await this.prisma.$transaction([
      this.prisma.comment.deleteMany({ where: { postId: id } }),
      this.prisma.like.deleteMany({ where: { postId: id } }),
    ]);
    return "Post deleted successfully";
  }
}

export default PostServices;
