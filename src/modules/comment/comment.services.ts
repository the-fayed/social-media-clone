import { PrismaClient } from "@prisma/client";

import SanitizeData from "./../../shared/utils/sanitize.data";
import { CommentSanitize, CreateNewCommentBody, DeleteCommentBody, GetAllCommentsApiFeature, UpdateCommentBody } from "./comment.interfaces";
import ApiError from "./../../shared/utils/api.error";
import ApiFeatures from "./../../shared/utils/api.features/api.features";
import { ReqQuery } from "./../../shared/utils/api.features/api.features.interfaces";

class CommentServices {
  private sanitizeData: SanitizeData;
  private prisma: PrismaClient;
  constructor() {
    this.sanitizeData = new SanitizeData();
    this.prisma = new PrismaClient();
  }
  // create new comment
  async createNewComment(createNewCommentBody: CreateNewCommentBody): Promise<CommentSanitize> {
    const { desc, postId, commentAuthorId } = createNewCommentBody;
    const comment = (await this.prisma.comment.create({
      data: {
        desc: desc,
        postId: postId,
        commentAuthorId: commentAuthorId,
      },
      include: {
        commentAuthor: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    })) as CommentSanitize;
    if (!comment) throw new ApiError("Error while creating comment, please try again later", 400);
    return this.sanitizeData.comment(comment);
  }
  // get all comments on specific post
  async getAllComments(postId: number, reqQuery: ReqQuery): Promise<GetAllCommentsApiFeature> {
    const feature = new ApiFeatures(
      this.prisma.comment.findMany({
        where: { postId: postId },
        select: {
          commentAuthor: { select: { name: true, id: true } },
          commentAuthorId: false,
          postId: true,
          desc: true,
          id: true,
        },
      }),
      reqQuery
    );
    const { dbQuery, paginationResult } = feature;
    const comments = await dbQuery;
    if (!comments) throw new ApiError("There is no comments on this post", 404);
    return { paginationResult, comments };
  }
  // get specific comment
  async getSpecificComment(id: number): Promise<CommentSanitize> {
    const comment = (await this.prisma.comment.findUnique({
      where: { id: id },
      include: { commentAuthor: { select: { name: true, id: true } } },
    })) as CommentSanitize;
    if (!comment) throw new ApiError("Comment not found", 404);
    return this.sanitizeData.comment(comment);
  }
  /**
   * update comment
   * ! only allowed for comment author
   */
  async updateSpecificComment(updateCommentBody: UpdateCommentBody): Promise<CommentSanitize> {
    const { id, commentAuthorId, desc } = updateCommentBody;
    const comment = (await this.prisma.comment.update({
      where: { id: id, commentAuthorId: commentAuthorId },
      data: { desc: desc ? desc : undefined },
      select: { postId: true, desc: true, commentAuthorId: false, commentAuthor: { select: { name: true, id: true } } },
    })) as CommentSanitize;
    if (!comment) throw new ApiError("Error while updating comment", 400);
    return this.sanitizeData.comment(comment);
  }
  /**
   *  delete comment
   *  ! allowed to comment author or post author
   */
  async deleteSpecificComment(deleteCommentBody: DeleteCommentBody): Promise<string> {
    const { commentId, postId, loggedUser } = deleteCommentBody;
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
    let deleted: {};
    if (comment && comment.commentAuthorId === loggedUser) {
      deleted = await this.prisma.comment.delete({ where: { id: commentId, commentAuthorId: loggedUser } });
    }
    if (postId) {
      const post = await this.prisma.post.findUnique({ where: { id: postId } });
      if (post.postAuthorId === loggedUser) {
        deleted = await this.prisma.comment.delete({ where: { id: commentId } });
      }
    }
    if (!deleted) throw new ApiError("Comment not found", 404);
    return "Comment deleted successfully";
  }
}

export default CommentServices;
