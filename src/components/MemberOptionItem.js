import React from 'react';
import {Row} from "antd";
import {Avatar, Icon, PopConfirm} from "./index";

const MemberOptionItem = ({item, onDelete}) => {
  return (
    <Row align="middle" justify="space-between" className="memberOption">
      <Row align="middle">
        <Avatar size={25} src={item.avatar} name={item.firstName}/>
        <div className="ellipsis">{item.firstName} {item.lastName}</div>
      </Row>
      <PopConfirm
        onConfirm={() => onDelete(item._id)}
        title="Are you sure to remove this member?"
        content={<div className="close"><Icon name="close"/></div>}
      />
    </Row>
  );
};

export default MemberOptionItem;
