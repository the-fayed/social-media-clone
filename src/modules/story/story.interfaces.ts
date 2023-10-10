import { Privacy } from '@prisma/client';
import { Paginate } from './../../shared/utils/api.features/api.features.interfaces';

export interface CreateStoryBody {
  storyAuthorId: number;
  image: string | undefined;
  privacy?: Privacy
}

export interface StorySanitize {
  id: number;
  image: string | undefined;
  storyAuthor: {
    id: number;
    name: string;
  };
};

export interface GetStoriesApiFeature {
  stories: Array<StorySanitize>,
  paginationResult: Paginate;
}

export interface DeleteStoryBody {
  storyAuthorId: number
  storyId: number
}

export interface UpdateStoryPrivacyBody {
  storyId: number,
  storyAuthorId: number,
  privacy: Privacy;
}
