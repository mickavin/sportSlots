import {
  CLEAR_SENT_MESSAGE,
  CONVERSATION_REPLY,
  CONVERSATION_REPLY_SUCCESS,
  CREATE_CONVERSATION,
  CREATE_CONVERSATION_SUCCESS,
  CREATE_GROUP_SUCCESS,
  DELETE_CONVERSATION,
  DELETE_CONVERSATION_SUCCESS,
  EXIT_CONVERSATION_SUCCESS,
  GET_CONVERSATIONS,
  GET_CONVERSATIONS_SUCCESS,
  REFRESH_CONVERSATION,
  SET_SEEN_MESSAGES,
  SET_SEEN_MESSAGES_SUCCESS,
  UPDATE_GROUP_IMAGE_SUCCESS,
} from "./constants";

export const getConversations = data => ({type: GET_CONVERSATIONS, data});
export const getConversationsSuccess = payload => ({type: GET_CONVERSATIONS_SUCCESS, payload});

export const createConversation = data => ({type: CREATE_CONVERSATION, data});
export const createConversationSuccess = payload => ({type: CREATE_CONVERSATION_SUCCESS, payload});

export const createGroupSuccess = payload => ({type: CREATE_GROUP_SUCCESS, payload});

export const updateGroupImageSuccess = payload => ({type: UPDATE_GROUP_IMAGE_SUCCESS, payload});

export const conversationReply = data => ({type: CONVERSATION_REPLY, data});
export const conversationReplySuccess = payload => ({type: CONVERSATION_REPLY_SUCCESS, payload});

export const setSeenMessages = data => ({type: SET_SEEN_MESSAGES, data});
export const setSeenMessagesSuccess = payload => ({type: SET_SEEN_MESSAGES_SUCCESS, payload});

export const refreshConversation = payload => ({type: REFRESH_CONVERSATION, payload});

export const clearSentMessage = payload => ({type: CLEAR_SENT_MESSAGE, payload});

export const deleteConversation = data => ({type: DELETE_CONVERSATION, data});
export const deleteConversationSuccess = payload => ({type: DELETE_CONVERSATION_SUCCESS, payload});

export const exitConversationSuccess = payload => ({type: EXIT_CONVERSATION_SUCCESS, payload});
