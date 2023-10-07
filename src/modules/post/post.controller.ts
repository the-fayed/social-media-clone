import asyncHandler from "express-async-handler";

import PostServices from "./post.services";
import { AuthorizationRequest } from "./../../modules/auth/auth.interfaces";
import { CreatePostBody, UpdatePostBody } from "./post.interfaces";
import ApiError from "./../../utils/api.error";

class PostController {
  private postService: PostServices;
  constructor() {
    this.postService = new PostServices();
  }
  /**
   *  @desc     Create new post
   *  @route    POST /api/v1/posts
   *  @access   Private (User)
   */
  createNewPost = asyncHandler(async (req: AuthorizationRequest, res, next): Promise<void> => {
    const createPostBody: CreatePostBody = {
      postAuthorId: Number(req.user.id),
      desc: req.body.desc,
      image: req.file?.path,
    };
    const post = await this.postService.createNewPost(createPostBody);
    if (!post) return next(new ApiError("Can not create post at time", 500));
    res.status(201).json({ status: "success", data: post });
  });

  /**
   *  @desc     Get all posts
   *  @route    GET /api/v1/posts || /api/v1/users/:authorId/posts
   *  @access   Private (User)
   */
  getAllPosts = asyncHandler(async (req, res, next): Promise<void> => {
    let id;
    if (req.params.authorId) id = Number(req.params.authorId);
    const posts = await this.postService.getAllPosts(id);
    if (!posts) return next(new ApiError("Can not get posts at time", 500));
    res.status(200).json({ status: "success", data: posts });
  });

  /**
   *  @desc     Get specific post
   *  @route    GET /api/v1/posts/:id
   *  @access   Private (User)
   */
  getSpecificPost = asyncHandler(async (req, res, next): Promise<void> => {
    const id = Number(req.params.id);
    const post = await this.postService.getSpecificPost(id);
    if (!post) return next(new ApiError("Can not get this post at this time", 500));
    res.status(200).json({ status: "success", data: post });
  });

  /**
   *  @desc     Update specific post
   *  @route    GET /api/v1/posts/:id
   *  @access   Private (User)
   */
  updateSpecificPost = asyncHandler(async (req: AuthorizationRequest, res, next): Promise<void> => {
    const updatePostBody: UpdatePostBody = {
      id: Number(req.params.id),
      desc: req.body.desc,
      image: req.file?.path,
      postAuthorId: req.user.id,
    };
    const post = await this.postService.updateSpecificPost(updatePostBody);
    if (!post) return next(new ApiError("Can not update this post at time", 500));
    res.status(200).json({ status: "success", data: post });
  });

  /**
   *  @desc     Delete specific post
   *  @route    GET /api/v1/posts/:id
   *  @access   Private (User)
   */
  deleteSpecificPost = asyncHandler(async (req: AuthorizationRequest, res, next): Promise<void> => {
    const [id, authorId] = [Number(req.params.id), Number(req.user.id)];
    const result = await this.postService.deleteSpecificPost(id, authorId);
    if (!result) return next(new ApiError("can not delete this post at time", 500));
    res.status(200).json({ status: "success", message: result });
  });
}

export default PostController;
