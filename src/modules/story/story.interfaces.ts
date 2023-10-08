import { Privacy } from '@prisma/client';

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

export interface DeleteStoryBody {
  storyAuthorId: number
  storyId: number
}

export interface UpdateStoryPrivacyBody {
  storyId: number,
  storyAuthorId: number,
  privacy: Privacy;
}
