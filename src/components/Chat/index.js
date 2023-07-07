import React from 'react';
import {Col, Row} from "antd";
import {useDispatch, useSelector} from "react-redux";
import Sidebar from "./Sidebar";
import cx from 'classnames';
import {Icon, PopConfirm, Popover, Spinner} from "../index";
import ChatRoom from './Room';
import {createConversationSuccess, deleteConversation, getConversations, refreshConversation} from "./actions";
import {disconnectSocket, initiateSocket, newChat, refreshMessages} from "./socket";
import {axios} from "../../config";

const Chat = () => {
  const [chatData, setChatData] = React.useState({});
  const user = useSelector(s => s.auth.user.data);
  const conversations = useSelector(s => s.chat.conversations);
  const chatCreating = useSelector(s => s.chat.chatCreating);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getConversations());
    return () => {disconnectSocket()}
  }, []);

  React.useEffect(() => {
    if (user._id) {
      initiateSocket(user._id);
      refreshMessages(data => dispatch(refreshConversation(data)));
      newChat(data => dispatch(createConversationSuccess({conversation: data})));
    }
  }, [user._id]);

  React.useEffect(() => {
    if (chatData._id)
      axios.get('/chat/conversation/' + chatData._id).then(res => setChatData(res.data));
  }, [chatData._id]);

  const deleteChat = React.useMemo(() => <PopConfirm
    title="Are you sure to create this chat?"
    onConfirm={() => {dispatch(deleteConversation(chatData._id)); setChatData({})}}
    content={<div>Delete</div>}
  />, [chatData._id]);

  const recipient = chatData.users?.find(x => x._id !== user._id);
  const groupName = chatData.isGroup ? chatData.name : '';

  return (
    <div className="chatContainer">
      <Row>
        <Col className={cx('sidebarCol', {visible: !chatData._id})}>
          <Sidebar user={user} conversations={conversations} setChat={setChatData}/>
        </Col>
        {chatCreating ? <div className="loadingWrapper"><Spinner/></div> : chatData?._id ?
          <Col className="chatContent">
            <div className="chatHeader">
              <div className="mobileMenu" onClick={() => setChatData({})}><Icon name="menu"/></div>
              <div>{groupName ? groupName : recipient && recipient.firstName + ' ' + recipient.lastName}</div>
              <Popover
                button={<div className="menu-icon"><div><Icon name="dots-vertical"/></div></div>}
                menu={[{value: 1, label: deleteChat}]} placement="bottomRight"
              />
            </div>
            <ChatRoom chatData={chatData} setChatData={setChatData}/>
          </Col> : null
        }
      </Row>
    </div>
  );
};

export default Chat;
