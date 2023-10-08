import { Privacy } from "@prisma/client";

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
}

export interface getSpecificPostBody {
  loggedUserId: number;
  postId: number;
}
