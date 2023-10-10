import { PrismaClient } from "@prisma/client";

import { ConversationSanitize, CreateNewConversationBody, GetConversationApiFeature } from "./conversation.interfaces";
import ApiError from "./../../shared/utils/api.error";
import ApiFeatures from "./../../shared/utils/api.features/api.features";
import { ReqQuery } from "./../../shared/utils/api.features/api.features.interfaces";

class ConversationServices {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient()
  }

  // create new conversation
  async createNewConversation(createNewConversationBody: CreateNewConversationBody): Promise<ConversationSanitize> {
    const { senderId, receiverId } = createNewConversationBody;
    const conversation = (await this.prisma.conversation.create({
      data: { senderId: senderId, receiverId: receiverId },
      select: {
        receiver: { select: { name: true, id: true } },
        id: true,
        sender: { select: { name: true, id: true } },
      },
    })) as ConversationSanitize;
    if (!conversation) throw new ApiError("Error while creating conversation, please try again", 400);
    return conversation;
  }
  // get conversations
  async getLoggedUserConversations(loggedUserId: number, reqQuery: ReqQuery): Promise<GetConversationApiFeature> {
    const documentCount = await this.prisma.conversation.count({
      where: { OR: [{ senderId: loggedUserId }, { receiverId: loggedUserId }] },
    });
    const feature = new ApiFeatures(
      this.prisma.conversation.findMany({
        where: { OR: [{ senderId: loggedUserId }, { receiverId: loggedUserId }] },
        select: {
          id: true,
          sender: { select: { name: true, id: true } },
          receiver: { select: { name: true, id: true } },
        },
      }),
      reqQuery
    ).paginate(documentCount);
    const { dbQuery, paginationResult } = feature;
    const conversations = (await dbQuery) as Array<ConversationSanitize>;
    if (!conversations) throw new ApiError("You did not make any conversation yet", 404);
    return { paginationResult, conversations };
  }
}

export default ConversationServices;
