import React, {useMemo} from 'react';
import {Button, Card, Icon, PopConfirm, Popover} from "./index";
import {useDispatch, useSelector} from "react-redux";
import {addMember, removeMember} from "../pages/Project/actions";
import {Row, Col} from "antd";
import UserSearch from "./UserSearch";
import {toast} from "react-toastify";
import {validateEmail} from "../utils/helpers";

const ProjectMembers = ({height, ...props}) => {
  const [newMember, setNewMember] = React.useState(null);
  const [memberSearch, setMemberSearch] = React.useState('');
  const members = useSelector(s => s.company?.companyDetail?.data?.employees);
  const userId = useSelector(s => s.auth.user.data._id);
  const dispatch = useDispatch();


  return (
    <Card title="Membres de votre entreprise" className="dashboardCard" height={height}>
      {members?.map((item, index) =>
        <div className="memberItem" key={item._id}>
          <div>
            <Row align="middle">
              <div style={{marginRight: 8}}>{item?.firstName + ' ' + item?.lastName}</div>
              
            </Row>
            <div className="email">{item?.email}</div>
          </div>
          <div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ProjectMembers;
