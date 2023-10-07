import { PrismaClient } from "@prisma/client";

import SanitizeData from "./../../utils/sanitize.data";
import { CommentSanitize, CreateNewCommentBody, DeleteCommentBody, UpdateCommentBody } from "./comment.interfaces";
import ApiError from "./../../utils/api.error";

const prisma = new PrismaClient();

class CommentServices {
  private sanitizeData: SanitizeData;
  constructor() {
    this.sanitizeData = new SanitizeData();
  }
  // create new comment
  async createNewComment(createNewCommentBody: CreateNewCommentBody): Promise<CommentSanitize> {
    const { desc, postId, commentAuthorId } = createNewCommentBody;
    const comment = (await prisma.comment.create({
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
  async getAllComments(postId: number | undefined): Promise<Array<CommentSanitize>> {
    // TODO - add pagination and search functionality here
    const comments = (await prisma.comment.findMany({
      where: { postId: postId },
      select: { commentAuthorId: false, desc: true, postId: true, commentAuthor: { select: { name: true, id: true } } },
    })) as Array<CommentSanitize>;
    if (!comments) throw new ApiError("There is no comments on this post", 404);
    return comments;
  }
  // get specific comment
  async getSpecificComment(id: number): Promise<CommentSanitize> {
    const comment = (await prisma.comment.findUnique({
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
    const comment = (await prisma.comment.update({
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
    const { id, commentAuthorId, postAuthorId } = deleteCommentBody;
    // TODO - enable post author to delete comments on his post
    const comment = await prisma.comment.delete({ where: { id: id, commentAuthorId: commentAuthorId } });
    if (!comment) throw new ApiError("Comment not found", 404);
    return "Comment deleted successfully";
  }
}

export default CommentServices;
