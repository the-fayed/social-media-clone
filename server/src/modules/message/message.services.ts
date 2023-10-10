import { PrismaClient } from "@prisma/client";
import { GetMessageInSpecificConversationBody, SanitizeMessage, SendMessageBody } from "./message.interfaces";
import ApiError from "./../../shared/utils/api.error";


class MessageServices {
  private prisma : PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  // send a message
  async sendMessage(sendMessageBody: SendMessageBody): Promise<SanitizeMessage> {
    const { senderId, receiverId, conversationId, messageBody } = sendMessageBody;
    try {
      const message = (await this.prisma.message.create({
        data: { conversationId: conversationId, senderId: senderId, receiverId: receiverId, message: messageBody },
        select: {
          id: true,
          message: true,
          sender: { select: { name: true, id: true } },
          receiver: { select: { name: true, id: true } },
          conversationId: true,
        },
      })) as SanitizeMessage;
      if (!message) throw new ApiError("Error while sending message", 400);
      return message;
    } catch (error) {
      throw new ApiError(`${error.message}`, 500);
    }
  }
  // get logged user message in specific conversation
  async getMessageInSpecificConversation(
    getMessageInSpecificConversation: GetMessageInSpecificConversationBody
  ): Promise<Array<SanitizeMessage>> {
    const { loggedUserId, conversationId } = getMessageInSpecificConversation;
    try {
      const messages = (await this.prisma.message.findMany({
        where: {
          OR: [
            { conversationId: conversationId, senderId: loggedUserId },
            { conversationId: conversationId, receiverId: loggedUserId },
          ],
        },
        orderBy: {
          sentAt: "desc",
        },
        select: {
          message: true,
          id: true,
          conversationId: true,
          sender: { select: { name: true, id: true } },
          receiver: { select: { name: true, id: true } },
        },
      })) as Array<SanitizeMessage>;
      if (!messages) throw new ApiError('No messages found', 404);
      return messages
    } catch (error) {
      throw new ApiError(`${error.message}`, 500);
    }
  }
}

export default MessageServices;
