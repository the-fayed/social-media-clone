export interface FollowOrUnFollowUserBody {
  follower: number | undefined;
  following: number | undefined;
}

export interface SanitizeFollowers {
  id: number | undefined;
  followers: {
    name: string | undefined;
    id: number | undefined;
  }
};

export interface SanitizeFollowing {
  id: number | undefined;
  followedUser: {
    id: number | undefined;
    name: string | undefined;
  };
}
