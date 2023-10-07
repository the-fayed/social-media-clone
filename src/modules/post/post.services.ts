import { PrismaClient } from "@prisma/client";

import SanitizeData from "../../utils/sanitize.data";
import { CreatePostBody, PostSanitize, UpdatePostBody } from "./post.interfaces";
import ApiError from "./../../utils/api.error";
import cloudinary from './../../config/cloudinary';

const prisma = new PrismaClient();

class PostServices {
  private sanitizeData: SanitizeData;
  constructor() {
    this.sanitizeData = new SanitizeData();
  }
  // create post
  async createNewPost(createPostBody: CreatePostBody): Promise<PostSanitize> {
    const { postAuthorId, desc } = createPostBody;
    let { image} = createPostBody;
    if (image) {
      const avatarResult = await cloudinary.uploader.upload(image, {
        folder: "uploads/user/avatar",
        format: "jpg",
        public_id: `${Date.now()}-avatar`,
      });
      image = avatarResult.url;
    }
    const post = (await prisma.post.create({
      data: {
        postAuthorId: postAuthorId,
        desc: desc,
        image: image,
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
    if (!post) throw new ApiError("Error while creating your post, please try again later", 400);
    return this.sanitizeData.post(post);
  }
  // update post
  async updateSpecificPost(updatePostBody: UpdatePostBody): Promise<PostSanitize> {
    const { postAuthorId, id, desc } = updatePostBody;
        let { image } = updatePostBody;
        if (image) {
          const avatarResult = await cloudinary.uploader.upload(image, {
            folder: "uploads/user/avatar",
            format: "jpg",
            public_id: `${Date.now()}-avatar`,
          });
          image = avatarResult.url;
        }
    const post = (await prisma.post.update({
      where: { postAuthorId: postAuthorId, id: id },
      data: {
        desc: desc ? desc : undefined,
        image: image ? image : undefined,
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
  async getAllPosts(authorId: undefined | number): Promise<Array<PostSanitize>> {
    let filter = {};
    if (authorId) {
      filter = { postAuthorId: authorId };
    }
    console.log(filter);
    const posts = (await prisma.post.findMany({
      where: filter,
      include: {
        postAuthor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })) as Array<PostSanitize>;
    if (!posts) throw new ApiError("Not posts found", 404);
    return posts;
  }
  // get specific post
  async getSpecificPost(id: number): Promise<PostSanitize> {
    const post = (await prisma.post.findUnique({
      where: { id: id },
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
