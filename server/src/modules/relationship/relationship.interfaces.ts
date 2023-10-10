import { Paginate } from "./../../shared/utils/api.features/api.features.interfaces";

export interface FollowOrUnFollowUserBody {
  follower: number | undefined;
  following: number | undefined;
}

export interface SanitizeFollowers {
  id: number | undefined;
  followers: {
    name: string | undefined;
    id: number | undefined;
  };
}

export interface GetLoggedUserFollowersApiFeature {
  followers: Array<SanitizeFollowers>;
  paginationResult: Paginate;
}

export interface SanitizeFollowing {
  id: number | undefined;
  followedUser: {
    id: number | undefined;
    name: string | undefined;
  };
}

export interface GetLoggedUserFollowingsApiFeature {
  following: Array<SanitizeFollowing>;
  paginationResult: Paginate;
}
