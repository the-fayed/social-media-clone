import asyncHandler from "express-async-handler";

import ConversationServices from "./conversation.services";
import { AuthorizationRequest } from "../auth/auth.interfaces";
import { CreateNewConversationBody } from "./conversation.interfaces";
import ApiError from "./../../shared/utils/api.error";

class ConversationControllers {
  private conversationServices: ConversationServices;
  constructor() {
    this.conversationServices = new ConversationServices();
  }

  /**
   *  @desc     Create new conversation
   *  @route    POST /api/v1/conversations
   *  @access   Private (User)
   */
  createNewConversation = asyncHandler(async (req: AuthorizationRequest, res, next): Promise<void> => {
    const createNewConversationBody: CreateNewConversationBody = {
      senderId: Number(req.user.id),
      receiverId: Number(req.body.receiverId),
    };
    const results = await this.conversationServices.createNewConversation(createNewConversationBody);
    if (!results) return next(new ApiError("Can not create a conversation at this moment", 500));
    res.status(201).json({ status: "success", data: results });
  });

  /**
   *  @desc     Get logged user conversations
   *  @route    POST /api/v1/conversations
   *  @access   Private (User)
   */
  getLoggedUserConversations = asyncHandler(async (req: AuthorizationRequest, res, next): Promise<void> => {
    const [loggedUserId, reqQuery] = [Number(req.user.id), req.query];
    const results = await this.conversationServices.getLoggedUserConversations(loggedUserId, reqQuery);
    if (!results.conversations) return next(new ApiError("Can not get any conversations at the time", 500));
    res
      .status(200)
      .send({ status: "success", paginationResult: results.paginationResult, data: results.conversations });
  });
}

export default ConversationControllers;
