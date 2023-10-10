import asyncHandler from "express-async-handler";
import MessageServices from "./message.services";
import { AuthorizationRequest } from "./../../modules/auth/auth.interfaces";
import { GetMessageInSpecificConversationBody, SendMessageBody } from "./message.interfaces";
import ApiError from "./../../shared/utils/api.error";

class MessageControllers {
  private messageServices: MessageServices;
  constructor() {
    this.messageServices = new MessageServices();
  }

  /**
   *  @desc     Send message
   *  @route    POST /api/v1/conversations/:conversationId/messages
   *  @access   Private (User)
   */
  sendMessage = asyncHandler(async (req: AuthorizationRequest, res, next): Promise<void> => {
    const sendMessageBody: SendMessageBody = {
      conversationId: Number(req.params.conversationId),
      senderId: Number(req.user.id),
      messageBody: req.body.message,
      receiverId: Number(req.body.receiverId),
    };
    const message = await this.messageServices.sendMessage(sendMessageBody);
    if (!message) return next(new ApiError("Can not send any message at the moment", 500));
    res.status(201).json({ status: "success", data: message });
  });

  /**
   *  @desc     Get messages in specific conversation
   *  @route    POST /api/v1/conversations/:conversationId/messages
   *  @access   Private (User)
   */
  getMessagesInSpecificConversation = asyncHandler(async (req: AuthorizationRequest, res, next): Promise<void> => {
    const getMessageInSpecificConversationBody: GetMessageInSpecificConversationBody = {
      conversationId: Number(req.params.conversationId),
      loggedUserId: Number(req.user.id),
    };
    const messages = await this.messageServices.getMessageInSpecificConversation(getMessageInSpecificConversationBody);
    if (!messages) return next(new ApiError('Can not process your request at the moment', 500));
    res.status(200).json({status: 'success', data: messages});
  });
}

export default MessageControllers;
