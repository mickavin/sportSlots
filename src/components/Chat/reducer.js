import produce from 'immer';
import {
  CLEAR_SENT_MESSAGE,
  CONVERSATION_REPLY_SUCCESS,
  CREATE_CONVERSATION,
  CREATE_CONVERSATION_SUCCESS,
  CREATE_GROUP_SUCCESS,
  DELETE_CONVERSATION_SUCCESS,
  EXIT_CONVERSATION_SUCCESS,
  GET_CONVERSATIONS,
  GET_CONVERSATIONS_SUCCESS,
  REFRESH_CONVERSATION,
  SET_SEEN_MESSAGES_SUCCESS,
  UPDATE_GROUP_IMAGE_SUCCESS,
  UPDATE_GROUP_SUCCESS,
} from "./constants";

export const initialState = {
  conversations: {
    loading: false,
    data: []
  },
  chatCreating: false,
  sentMessage: null
};

export default function (state = initialState, action = {}) {
  return produce(state, draft => {
    switch (action.type) {
      case GET_CONVERSATIONS:
        draft.conversations.loading = true;
        break;
      case GET_CONVERSATIONS_SUCCESS:
        draft.conversations = {loading: false, data: action.payload};
        break;
      case CREATE_CONVERSATION:
        draft.chatCreating = true;
        break;
      case CREATE_CONVERSATION_SUCCESS:
        draft.conversations.data.unshift(action.payload.conversation);
        draft.chatCreating = false;
        break;
      case CREATE_GROUP_SUCCESS:
        draft.conversations.data.unshift(action.payload);
        break;
      case CONVERSATION_REPLY_SUCCESS:
        draft.conversations.data = state.conversations.data.map(c => c._id === action.payload.message.conversationId ?
          ({...c, message: action.payload.message}) : c);
        draft.sentMessage = action.payload.message;
        break;
      case CLEAR_SENT_MESSAGE:
        draft.sentMessage = null;
        break;
      case REFRESH_CONVERSATION:
        draft.conversations.data = state.conversations.data.map(c => c._id === action.payload.conversationId ?
          ({...c, message: action.payload, unseenMessageLength: (c.unseenMessageLength || 0) + 1}) : c);
        break;
      case SET_SEEN_MESSAGES_SUCCESS:
        draft.conversations.data = state.conversations.data.map(c => c._id === action.payload.conversationId ?
          ({...c, message: {...c.message, seenBy: [...(c.message?.seenBy || []), action.payload.userId]}, unseenMessageLength: 0}) : c);
        break;
      case UPDATE_GROUP_IMAGE_SUCCESS:
        const index = state.conversations.data.findIndex(x => x._id === action.payload.conversationId);
        draft.conversations.data[index].image = action.payload.path;
        break;
      case UPDATE_GROUP_SUCCESS:
        const conIndex = state.conversations.data.findIndex(x => x._id === action.payload.conversationId);
        draft.conversations.data[conIndex].name = action.payload.name;
        break;
      case DELETE_CONVERSATION_SUCCESS:
      case EXIT_CONVERSATION_SUCCESS:
        draft.conversations.data = state.conversations.data.filter(x => x._id !== action.payload);
        break;
    }
  });
}
