import React from 'react';
import {Popconfirm as RawComp} from "antd";

const PopConfirm = ({title, onConfirm, onCancel, okText, cancelText, content}) => {
  return (
    <RawComp
      title={title}
      onConfirm={onConfirm}
      onCancel={onCancel}
      okText={okText || "Yes"}
      cancelText={cancelText || "No"}
      overlayClassName="popConfirm"
    >
      {content}
    </RawComp>
  )
};

export default PopConfirm;
