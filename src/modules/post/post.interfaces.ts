export interface IPost {
  author: number,
  disc: string,
  image?: string,
  likes?: Array<object>,
  comments?: Array<object>,
}

export interface PostSanitize extends IPost {
  id: number
}