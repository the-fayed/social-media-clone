export interface SendMessageBody {
  messageBody: string;
  senderId: number;
  receiverId: number;
  conversationId: number;
}

export interface SanitizeMessage {
  message: string;
  sender: {
    name: string;
    id: number;
  };
  receiver: {
    id: number;
    name: string;
  };
  conversationId: number;
};

export interface GetMessageInSpecificConversationBody {
  conversationId: number;
  loggedUserId: number;
}
