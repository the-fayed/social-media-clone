import { Paginate } from "./../../shared/utils/api.features/api.features.interfaces";

export interface CreateNewConversationBody {
  senderId: number;
  receiverId: number;
}

export interface ConversationSanitize {
  id: number;
  sender: {
    id: number;
    name: string;
  };
  receiver: {
    id: number;
    name: string;
  };
  createdAt: Date;
}

export interface GetConversationApiFeature {
  conversations: Array<ConversationSanitize> | null;
  paginationResult: Paginate;
}
