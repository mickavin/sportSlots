import React from 'react';
import AutoComplete from "./basics/AutoComplete";
import {Icon, Avatar, Popover} from "./index";
import {Row, Col, Switch} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {logout, setMode} from "../pages/login/actions";
import {setNotificationsSeen} from "../pages/dashboard/actions";
import { useRouter } from 'next/router';
import axios from "../config/axios";
import {delay} from "../utils/helpers";

const HeaderRight = () => {
  const [searchOpts, setSearchOpts] = React.useState([]);
  const [searchText, setSearchText] = React.useState([]);
  const [unseenNotification, setUnseenNotification] = React.useState(false);
  const dispatch = useDispatch();
  const darkMode = useSelector(s => s.auth.mode === 'dark');
  const user = useSelector(s => s.auth.user.data);
  const navigate = useRouter();

  React.useEffect(() => {
    setUnseenNotification(user.notifications.filter(n => !n.seen).length > 0);
  }, [user.notifications]);

  const onSeen = React.useCallback(async (val) => {
    if (val) {
      await delay(500);
      setUnseenNotification(false);
      dispatch(setNotificationsSeen({ids: user.notifications.filter(n => !n.seen).map(n => n._id)}));
    }
  }, [user.notifications]);

  const onSearch = React.useCallback(async text => {
    setSearchText(text);
    if (text) {
      const res = await axios.get('/project/search?q=' + text);
      setSearchOpts(res.data.map(item => ({label: item.name, value: item._id})));
    }
  }, []);


  const logoutFunc = React.useCallback(() => {
    dispatch(logout());
    axios.setToken('');
    if(typeof window != 'undefined' ){
      localStorage.removeItem('token');
    }
    navigate.push('/login');
  }, []);

  return (
    <Row gutter={10} className="header-right">
      <Col>
        <Popover
          placement="bottomRight"
          button={<Avatar src={user.avatar} name={user.firstName} />}
          content={
            <div>
              <div className="popoverMenu">
                <div className="profileHead">
                  <Avatar src={user.avatar} name={user.firstName}/>
                  <div>{user.firstName} {user.lastName}</div>
                </div>
                {/* <div onClick={() => navigate('/dashboard/messages')} className="item">
                  <Row align="middle"><div className="ellipsis">Messages</div></Row>
                </div> */}
                <div onClick={() => navigate.push('/settings')} className="item">
                  <Row align="middle"><div className="ellipsis">Paramètres</div></Row>
                </div>
                <div onClick={logoutFunc} className="item">
                  <Row align="middle"><div className="ellipsis">Déconnexion</div></Row>
                </div>
                <div className="item">
                  <Row align="middle">
                    <div className="ellipsis">Mode sombre</div>
                    <Switch defaultChecked={darkMode} onChange={val => dispatch(setMode(val ? 'dark' : 'light'))}/>
                  </Row>
                </div>
              </div>
            </div>}
        />
      </Col>
    </Row>
  );
};

export default HeaderRight;
