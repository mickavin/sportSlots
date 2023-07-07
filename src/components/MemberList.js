import React from 'react';
import {Avatar} from "./index";
import { Tooltip } from 'antd';

const MemberList = ({members, size, max = 3, register = false}) => {
  const memberList = React.useMemo(() => members.map(m => m.user || m), [members]);
  return (
    <div className="memberAvatarList">
      {memberList.slice(0, max).map(m => 
      <Tooltip zIndex={99} placement="top" title={`${m.lastName} ${m.firstName}`}>
        <div className="member" key={m._id}>
          <Avatar size={size} src={m.avatar} name={m.firstName}/>
        </div>
      </Tooltip>)
      }
      {members.length > max ? <div className="memberSize">+{members.length - max} {register ? 'inscrits' : ''}</div> : null}
    </div>
  );
};

export default MemberList;
