import React from 'react';
import {Icon, Spinner} from "../../components";
import {Row} from "antd";
import cx from 'classnames';
import HeaderRight from "../../components/HeaderRight";
import {useDispatch, useSelector} from "react-redux";
import {getUser} from "../login/actions";
import axios from '../../config/axios';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faBuilding, faClipboardList, faVolleyball, faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons'

const DashboardLayout = ({children}) => {
  const navigate = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(s => s.auth.user.data);
  // const loading = useSelector(s => 
  //   s.program.programs.loading || 
  //   s.program.programDetail.loading || 
  //   s.company.companies.loading || 
  //   s.company.companyDetail.loading || 
  //   s.sport.sports.loading || 
  //   s.sport.sportDetail.loading ||
  //   s.auth.user.loading || 
  //   s.auth.users.loading 
  //   );

  React.useEffect(() => {
    const token = typeof window != 'undefined' ? localStorage.getItem('token') : null;
    axios.setToken(token);
    dispatch(getUser())
  }, []);

  // const pIndex = 0
  const pIndex = React.useMemo(() => {
    const p = navigate.pathname
    return p?.includes('join-program') ? 1 : p.includes('list-users') ? 2 : p.includes('list-companies') ? 3 : p.includes('list-programs') ? 4 : p.includes('list-sports') ? 5 :  p.includes('my-programs') ? 6 : 1;
  }, [navigate.pathname]);
  if (!user?._id) return <Row style={{height:'100vh'}} align="middle" justify="center"><Spinner size="large"/></Row>;
  // if (loading) return <Row style={{height:'100vh'}} align="middle" justify="center"><Spinner size="large"/></Row>;

  return (
    <Row>
      <div className="menu-space"/>
      <div className="side-menu">
        <Row align="middle" className="logoContainer rounded-logo" onClick={() => navigate.push('/join-program')}>
          <Image src={require('../../images/logo.jpg').default} alt="copratik" width={120} height={120} style={{borderRadius: '60px'}}/>
        </Row>
        <div className="menu">
          {
            user?.role === 3 ?
            <div className={cx('menu-item', {active: pIndex === 1})} onClick={() => navigate.push('/join-program')}><FontAwesomeIcon icon={faArrowRightToBracket} /> <span>Rejoindre un programme</span></div>
            : null
          }
          {
            user?.role === 1 ?
            <div className={cx('menu-item', {active: pIndex === 2})} onClick={() => navigate.push('/list-users')}><FontAwesomeIcon icon={faUsers} /> <span>Liste des utilisateurs</span></div>
            : null
          }
          {
            user?.role === 1 ?
            <div className={cx('menu-item', {active: pIndex === 3})} onClick={() => navigate.push('/list-companies')}><FontAwesomeIcon icon={faBuilding} /> <span>Liste des entreprises</span></div>
            : null
          }
           {
            user?.role === 1 || user?.role === 2 ?
            <div className={cx('menu-item', {active: pIndex === 4})} onClick={() => navigate.push('/list-programs')}><FontAwesomeIcon icon={faClipboardList} />  <span>{user?.role === 1 ? 'Liste des programmes' : 'Mes coachings'}</span></div>
            : null
          }
          {
            user?.role === 1 ?
            <div className={cx('menu-item', {active: pIndex === 5})} onClick={() => navigate.push('/list-sports')}><FontAwesomeIcon icon={faVolleyball} />  <span>Liste des sports</span></div>
            : null
          }
          {
            user?.role === 3 ?
            <div className={cx('menu-item', {active: pIndex === 6})} onClick={() => navigate.push('/my-programs')}><FontAwesomeIcon icon={faClipboardList} />  <span>Mes inscriptions</span></div>
            : null
          }
        </div>
      </div>
      <div className="flex1">
        <div className="container">
          <HeaderRight/>
        </div>
        <div className="mt-50 container">
          {children}
        </div>
      </div>
    </Row>
  )
};

export default DashboardLayout;
