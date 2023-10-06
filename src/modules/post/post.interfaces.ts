import { GetUser } from "./../../modules/user/user.interfaces";

export interface IPost {
  postAuthor: GetUser;
  desc: string;
  image?: string;
  likes?: Array<object>;
  comments?: Array<object>;
}

export interface PostSanitize extends IPost {
  id: number;
}

export interface CreatePostBody {
  desc: string;
  image?: string;
  postAuthorId: number;
}

export interface UpdatePostBody {
  id: number;
  desc?: string;
  image?: string;
  postAuthorId: number;
}

export interface GetPost {
  id: number;
  desc?: string;
  image?: string;
  postAuthorId: number;
  likes?: Array<object>;
  comments?: Array<object>;
}
