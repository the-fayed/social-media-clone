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
  posts: Array<object>,
  comments: Array<object>,
  likes: Array<object>,
  stories: Array<object>
  followers: Array<object>,
  following: Array<object>
};


