import { Paginate } from './../../shared/utils/api.features/api.features.interfaces';

export interface IComment {
  commentAuthor: {
    name: string,
    id: number
  };
  postId: number;
  desc: string;
}

export interface CommentSanitize extends IComment{
  id: number
}

export interface GetAllCommentsApiFeature {
  comments: CommentSanitize,
  paginationResult: Paginate,
}

export interface CreateNewCommentBody {
  desc: string
  postId: number;
  commentAuthorId: number;
}

export interface UpdateCommentBody {
  id: number;
  desc: string;
  commentAuthorId: number;
}

export interface DeleteCommentBody {
  commentId: number;
  postId?: number;
  loggedUser?: number;
}