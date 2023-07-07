import React from 'react';
import {Bubble, GiftedChat} from "react-native-gifted-chat";
import ChatInput from "../Input";
import cx from "classnames";
import {getBubbleProps} from "../bubbleProps";
import {useDispatch, useSelector} from "react-redux";
import {disconnectSocket, initiateSocket, sendMessage, subscribeToChat} from "./socket";
import {axios} from "../../../config";
import {clearSentMessage, conversationReply, setSeenMessages} from "../actions";
import {Avatar, Spinner} from "../../index";
import {fixImgPath, mapMessageData} from "../../../utils/helpers";

const ChatRoom = ({chatData}) => {
  const [page, setPage] = React.useState(0);
  const [messages, setMessages] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const [recipient, setRecipient] = React.useState();
  const [recipients, setRecipients] = React.useState([]);
  const [isGroup, setIsGroup] = React.useState(false);
  const [loadingMoreMsg, setLoadingMoreMsg] = React.useState(false);
  const [noMoreMsg, setNoMoreMsg] = React.useState(false);
  const sentMessage = useSelector(s => s.chat.sentMessage);
  const user = useSelector(s => s.auth.user.data);
  const mode = useSelector(s => s.auth.mode);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (chatData?._id) {
      disconnectSocket();
      if (chatData._id) {
        fetchData(chatData._id);
        initiateSocket(chatData._id);
        subscribeToChat(data => {
          if (data.message) {
            setMessages(oldChats =>[data.message, ...oldChats]);
            dispatchSetSeenMessages([data.message._id]);
          }
        });
      }
    }
  }, [chatData]);

  const fetchData = React.useCallback(async (conversationId) => {
    const res = await axios.get('/chat/conversation/' + conversationId);
    setInitialData(res.data);
    setMessages(res.data.messages || []);
    const unseenMessages = res.data.messages.filter(m => m.user !== user._id && !m.seenBy?.includes(user._id)).map(m => m._id);
    dispatchSetSeenMessages(unseenMessages);
  }, [user._id]);
  const dispatchSetSeenMessages = React.useCallback((messageIds) => {
    dispatch(setSeenMessages({messageIds, conversationId: chatData._id, userId: user._id}));
  }, [user, chatData]);

  const setInitialData = React.useCallback((data) => {
    if (!data.isGroup) {
      const recipientUser = data.users.find(x => x._id !== user._id);
      setRecipient(recipientUser);
    }
    else {
      setRecipients(data.users.filter(x => x._id !== user._id));
      setIsGroup(true);
    }
  }, [user]);

  const appendMessage = React.useCallback((message, cb) => {
    const tempId = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
    setMessages(previousMessages => [{
      _id: tempId,
      ...message,
      createdAt: new Date(),
      user: {_id: user._id, name: user.name, avatar: user.avatar},
    }, ...previousMessages]);
    if (cb) cb(tempId);
  }, [user, recipients, isGroup, recipient]);

  const onSend = (message, id) => {
    const dbData = {conversationId: id, messageData: {...message}};
    dispatch(conversationReply(dbData));
  };

  React.useEffect(() => {
    if (sentMessage) {
      setMessages(messages => messages.map((msg, i) => i === 0 ? sentMessage : msg));
      sendMessage({...sentMessage, recipientIds: isGroup ? recipients.map(r => r._id) : [recipient._id]});
      dispatch(clearSentMessage());
    }
  }, [sentMessage, isGroup, recipients, recipient]);

  const loadMore = React.useCallback(async () => {
    if (!loadingMoreMsg) {
      const newPage = page + 1;
      setLoadingMoreMsg(true);
      const res = await axios.get(`/chat/conversation/${chatData._id}/messages?page=${newPage}`);
      setMessages(state => [...state, ...res.data.messages]);
      setLoadingMoreMsg(false);
      setPage(newPage);
      if (!res.data.messages.length) setNoMoreMsg(true);
    }
  }, [page, chatData, loadingMoreMsg]);

  const renderLoadMoreBtn = React.useMemo(() => (messages.length > 19 && !noMoreMsg) ?
    <div className="LoadBtn" onClick={loadMore}>{loadingMoreMsg ? <Spinner/>
      : <span>Load more</span>}</div>
    : null, [messages, loadingMoreMsg, noMoreMsg, page]);

  const messagesData = React.useMemo(() => mapMessageData(messages), [messages]);

  return (
    <div className="chatInner">
      <GiftedChat
        user={{_id: user._id}}
        extraData={[mode]}
        shouldUpdateMessage={(props, nextProps) => props.extraData[0] !== nextProps.extraData[0]}
        messages={messagesData}
        listViewProps={{ListFooterComponent: renderLoadMoreBtn}}
        renderAvatar={props => <Avatar src={props.currentMessage.user.avatar} name={props.currentMessage.user.firstName}/>}
        renderInputToolbar={() => <ChatInput value={message} onChange={setMessage} onSend={onSend} appendMessage={appendMessage} chatId={chatData._id} />}
        renderMessageText={props => {
          return <div className={cx('messageText', {right: props.position === 'right'})}>{props.currentMessage.text}</div>
        }}
        renderBubble={props => {
          if (props.currentMessage.file)
            return <a className={cx("fileMessage", {left: props.position === 'left'})} href={fixImgPath(props.currentMessage.file)} target="_blank">{props.currentMessage.fileName}</a>;
          else {
            const allProps = {...props, ...getBubbleProps(mode)};
            return <Bubble {...allProps}/>
          }
        }}
      />
    </div>
  )
};

export default ChatRoom;
