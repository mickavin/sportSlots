import React from 'react';
import {Row} from "antd";
import {Avatar, Icon, Input} from "../index";
import {sortConversations} from "../../utils/helpers";
import cx from 'classnames';
import {moment} from "../../utils/moment";
import {useDispatch, useSelector} from "react-redux";
import {axios} from "../../config";
import {createConversation} from "./actions";

const Sidebar = ({user, conversations, setChat}) => {
  const [createVisible, setCreateVisible] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [users, setUsers] = React.useState([]);
  const [wait, setWait] = React.useState(false);
  const chatCreating = useSelector(s => s.chat.chatCreating);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (search) axios.get('/user/search?q=' + search).then(res => setUsers(res.data));
    else setUsers([]);
  }, [search]);

  const msgText = React.useCallback((icon, text, unseenMessage) => <div className="msg"><Icon name={icon} size={16}/>
    <div className={cx('messageTxt', {unseen: unseenMessage})} style={{marginLeft: 4}}>{text}</div></div>, []);
  const renderItem = React.useCallback(item => {
    const recipient = item.users.find(x => x._id !== user._id);
    let text;
    const msg = item.message;
    const sender = msg?.user?._id === user._id;
    const unseenMessage = msg && !sender && !msg?.seenBy?.includes(user._id);
    const unseenMessageLength = item.unseenMessageLength;
    text = !msg ? <div className="messageTxt">Draft...</div>
      : msg.image ? msgText('image', 'Photo', unseenMessage)
      : msg.file ? msgText('file', 'File', unseenMessage):
        <div className={cx('messageTxt', {unseen: unseenMessage})}>{msg.text}</div>;
    const onCreateItem = () => {
      if (!wait) {
        setChat(item); setWait(true);
        setTimeout(() => {setWait(false)}, 1000);
      }
    };
    return (
      <div className={cx('item', {unseen: unseenMessage})} onClick={onCreateItem} key={item._id}>
        {recipient ?
          <Row>
            <Avatar src={!item.isGroup ? recipient.avatar : item.image} name={!item.isGroup ? recipient.firstName : item.name}/>
            <div className="itemTitleContainer">
              <div className={cx('userName', {unseen: unseenMessage})}>{!item.isGroup ? recipient.firstName : item.name}</div>
              <div>{text}</div>
            </div>
          </Row> : null
        }
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div className="time">{moment(msg?.createdAt || item.createdAt).fromNow()}</div>
          <div className="itemRight">
            {unseenMessage ? <div className="unseenCount">{unseenMessageLength > 9 ? '9+' : unseenMessageLength}</div> : <div style={{height: 0}} />}
            <div style={{opacity: (sender && !unseenMessage) ? 1 : 0}}><Icon name="seen" color="gray" size={15} /></div>
          </div>
        </div>
      </div>
    )
  }, [user._id, wait]);

  const onCreate = React.useCallback(async (target) => {
    if (!chatCreating) {
      const res = (await axios.get('/chat/conversation-exist/' + target._id)).data;
      if (res.isExist) setChat({_id: res.conversationId});
      else dispatch(createConversation({id: target._id, setChat}));
      setCreateVisible(false);
    }
  }, [user, chatCreating]);

  const renderSearchItem = React.useCallback(item =>
    <div className="userItem" onClick={() => onCreate(item)} key={item._id}>
      <Row>
        <Avatar src={item.avatar} name={item.firstName}/>
        <div>
          <div>{item.firstName} {item.lastName}</div>
          <div className="subTxt ellipsis">{item.email}</div>
        </div>
      </Row>
    </div>, []);

  return (
    <div className="sidebarContainer">
      <Row align="center" justify="space-between" className="head">
        <h3>Messages</h3>
        <div onClick={() => setCreateVisible(true)}>
          <Icon name="plus-circle"/>
        </div>
      </Row>
      <div className="chatList">
        {conversations.data.slice().sort(sortConversations).map(renderItem)}
      </div>
      {createVisible &&
      <div className="createContainer">
        <Row align="center" justify="space-between" className="head">
          <h3>Contacts</h3>
          <div onClick={() => setCreateVisible(false)}><Icon name="close"/></div>
        </Row>
        <Row className="searchContainer">
          <div className="icon"><Icon name="search" size={18}/></div>
          <Input placeholder="Search" value={search} onChange={setSearch}/>
        </Row>
        <div className="content">
          {!search && user.contacts.map(renderSearchItem)}
          {search && !!users.length && users.map(renderSearchItem)}
        </div>
      </div>}
    </div>
  )
};

export default Sidebar;
