export interface LikeData {
  postId: number;
  userId: number;
}

export interface LikeSanitize {
  postId: number;
  likeUser: { name: string; id: number };
}
