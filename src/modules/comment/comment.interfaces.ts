import { User } from './../../modules/user/user.interfaces';

export interface IComment {
  author: User,
  post: number,
  disc: string,
}

export interface CommentSanitize extends IComment{
  id: number
}