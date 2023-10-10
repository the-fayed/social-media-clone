import { Router } from "express";
import ConversationControllers from "./conversation.controllers";

import { protect } from "./../../shared/middlewares/protection";
import { allowTo } from "./../../shared/middlewares/user.permissions";
import messageRoutes from "./../message/message.routes";
import { createNewConversationValidator } from "./conversation.validator";

const router = Router();
const conversationControllers = new ConversationControllers();

router.use("/:conversationId/messages", messageRoutes);

router.use(protect, allowTo(["User"]));

router
  .route("/")
  .post(createNewConversationValidator, conversationControllers.createNewConversation)
  .get(conversationControllers.getLoggedUserConversations);

export default router;
