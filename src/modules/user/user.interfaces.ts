export interface User {
  name: string,
  username: string,
  email: string,
  password: string,
  id: number,
  createdAt: Date,
  updatedAt: Date,
  isActive: boolean,
  avatar: string | undefined,
  cover: string | undefined,
  city: string,
  website: string | undefined,
  posts: Array<string>,
  comments: Array<string>,
  likes: Array<string>,
  stories: Array<string>
  followers: Array<string>,
  following: Array<string>
};
