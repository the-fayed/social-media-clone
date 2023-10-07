import asyncHandler from "express-async-handler";

import CommentServices from "./comment.services";
import { AuthorizationRequest } from "./../../modules/auth/auth.interfaces";
import { CreateNewCommentBody, DeleteCommentBody, UpdateCommentBody } from "./comment.interfaces";
import ApiError from "./../../utils/api.error";

class CommentControllers {
  private commentServices: CommentServices;
  constructor() {
    this.commentServices = new CommentServices();
  }
  /**
   *  @desc     Create new comment
   *  @route    POST /api/v1/posts/:postId/comments
   *  @access   Private (Users)
   */
  createNewComment = asyncHandler(async (req: AuthorizationRequest, res, next): Promise<void> => {
    const createNewCommentBody: CreateNewCommentBody = {
      desc: req.body.desc,
      postId: Number(req.params.postId),
      commentAuthorId: Number(req.user.id),
    };
    const comment = await this.commentServices.createNewComment(createNewCommentBody);
    if (!comment) return next(new ApiError("you can not create comments at the moment", 500));
    res.status(201).json({ status: "success", data: comment });
  });

  /**
   *  @desc     Get all comments on specific post
   *  @route    GET /api/v1/posts/:postId/comments
   *  @access   Private (Users)
   */
  getAllComments = asyncHandler(async (req, res, next): Promise<void> => {
    const postId = Number(req.params.postId);
    const comments = await this.commentServices.getAllComments(postId);
    if (!comments) return next(new ApiError("Can not get comments for this post at the moment", 500));
    res.status(200).json({ status: "success", data: comments });
  });

  /**
   *  @desc     Get a specific comment
   *  @route    GET /api/v1/comments/:id
   *  @access   Private (Users)
   */
  getSpecificComment = asyncHandler(async (req, res, next): Promise<void> => {
    const id = Number(req.params.id);
    const comment = await this.commentServices.getSpecificComment(id);
    if (!comment) return next(new ApiError("Can not get this comment at the moment", 500));
    res.status(200).json({ status: "success", data: comment });
  });

  /**
   *  @desc     Updated a specific comment
   *  @route    PUT /api/v1/comments/:id
   *  @access   Private (Users)
   */
  updateSpecificComment = asyncHandler(async (req: AuthorizationRequest, res, next): Promise<void> => {
    const updateCommentBody: UpdateCommentBody = {
      id: Number(req.params.id),
      desc: req.body.desc,
      commentAuthorId: Number(req.user.id)
    };
    const comment = await this.commentServices.updateSpecificComment(updateCommentBody);
    if (!comment) return next (new ApiError('Can not update this comment at the moment', 500));
    res.status(200).json({status: 'success', message: 'Comment updated successfully', data: comment})
  })

  /**
   *  @desc     Delete a specific comment
   *  @route    DELETE /api/v1/comments/:id
   *  @access   Private (Users)
   */
  deleteSpecificComment = asyncHandler(async (req: AuthorizationRequest, res, next): Promise<void> => {
    const deleteCommentBody: DeleteCommentBody = {
      id: Number(req.params.id),
      commentAuthorId: Number(req.user.id),
    };
    const result = await this.commentServices.deleteSpecificComment(deleteCommentBody);
    if (!result) return next(new ApiError("Can not delete this comment at the moment", 500));
    res.status(200).json({ status: "success", data: result });
  });
}

export default CommentControllers;