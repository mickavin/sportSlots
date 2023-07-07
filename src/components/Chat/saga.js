import {put, call, takeLatest} from 'redux-saga/effects';
import axios from "../../config/axios";
import {createChat} from "./socket";
import {
  conversationReplySuccess,
  createConversationSuccess,
  createGroupSuccess,
  deleteConversationSuccess,
  exitConversationSuccess,
  getConversationsSuccess,
  setSeenMessagesSuccess,
  updateGroupImageSuccess,
} from './actions';
import {
  CONVERSATION_REPLY,
  CREATE_CONVERSATION,
  CREATE_GROUP,
  DELETE_CONVERSATION,
  EXIT_CONVERSATION,
  GET_CONVERSATIONS,
  SET_SEEN_MESSAGES,
  UPDATE_GROUP_IMAGE,
} from "./constants";

export function* getConversations() {
  const res = yield call(axios.get, '/chat/conversation');
  yield put(getConversationsSuccess(res.data.data));
}

export function* createConversation(action) {
  const res = yield call(axios.post, '/chat/conversation/' + action.data.id);
  yield put(createConversationSuccess({conversation: res.data, user: action.data}));
  yield action.data.setChat(res.data);
  createChat(res.data);
}

export function* conversationReply(action) {
  const res = yield call(axios.post, '/chat/conversation/reply/' + action.data.conversationId, action.data);
  yield put(conversationReplySuccess(res.data));
}

export function* setSeenMessages(action) {
  if (!!action.data.messageIds.length) {
    yield call(axios.put, '/chat/conversation/set-seen-messages', {messageIds: action.data.messageIds});
    yield put(setSeenMessagesSuccess(action.data))
  }
}

export function* createGroup(action) {
  const {name, participants, groupImage} = action.data;
  const res = yield call(axios.post, '/chat/group-conversation', {name, participants});
  yield put(createGroupSuccess(res.data));
  const chatData = {...res.data, image: groupImage?.uri};
  if (groupImage) {
    yield put(updateGroupImageSuccess({conversationId: res.data._id, path: groupImage.uri}));
    let data = new FormData();
    data.append('image', groupImage);
    const imgRes = yield call(axios.put,`/chat/conversation/group/${res.data._id}/image`, data, {headers: {"Content-Type": "multipart/form-data"}});
    createChat({...res.data, image: imgRes.data.path});
  } else
    createChat(chatData);
}

export function* updateGroupImage(action) {
  const res = yield call(axios.put, `/chat/conversation/group/${action.data.id}/image`, action.data.data);
  yield put(updateGroupImageSuccess(res.data.path));
}

export function* exitConversation(action) {
  yield call(axios.put, '/chat/conversation/group/' + action.data + '/exit');
  yield put(exitConversationSuccess(action.data));
}

export function* deleteConversation(action) {
  yield call(axios.delete, '/chat/conversation/' + action.data);
  yield put(deleteConversationSuccess(action.data));
}

export default function* loginSaga() {
  yield takeLatest(GET_CONVERSATIONS, getConversations);
  yield takeLatest(CONVERSATION_REPLY, conversationReply);
  yield takeLatest(SET_SEEN_MESSAGES, setSeenMessages);
  yield takeLatest(CREATE_GROUP, createGroup);
  yield takeLatest(UPDATE_GROUP_IMAGE, updateGroupImage);
  yield takeLatest(CREATE_CONVERSATION, createConversation);
  yield takeLatest(EXIT_CONVERSATION, exitConversation);
  yield takeLatest(DELETE_CONVERSATION, deleteConversation);
}
