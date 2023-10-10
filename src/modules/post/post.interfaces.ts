import { Privacy } from "@prisma/client";
import { ReqQuery } from './../../shared/utils/api.features/api.features.interfaces';

export interface IPost {
  postAuthor: {
    id: number;
    name: string;
  };
  desc: string;
  image?: string;
  likes?: Array<object>;
  comments?: Array<object>;
  privacy: Privacy;
}

export interface PostSanitize extends IPost {
  id: number;
  totalLikes?: number,
  totalComments?: number
}

export interface CreatePostBody {
  desc: string;
  image?: string | undefined;
  postAuthorId: number;
  privacy?: Privacy;
}

export interface UpdatePostBody {
  id: number;
  desc?: string;
  image?: string;
  postAuthorId: number;
  privacy?: Privacy;
}

export interface GetPost {
  id: number;
  desc?: string;
  image?: string;
  postAuthorId: number;
  likes?: Array<object>;
  comments?: Array<object>;
}

export interface GetAllPostsBody {
  authorId?: number | undefined;
  loggedUserId: number;
  reqQuery?: ReqQuery;
}

export interface GetSpecificPostBody {
  loggedUserId: number;
  postId: number;
}

export interface GetPostsApiFeatures {
  posts: Array<PostSanitize>;
  paginationResult: {
    limit: number | string;
    currentPage: string | number;
    documentCount: number;
    nextPage?: string | number;
    previousPage?: string | number;
  };
}
