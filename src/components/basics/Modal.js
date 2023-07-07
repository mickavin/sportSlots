import React from 'react';
import {Modal as RawComp} from "antd";
import cx from 'classnames';
import {useSelector} from "react-redux";

const Modal = ({title, visible, onOk, onCancel, okText, footer, className, ...props}) => {
  const darkMode = useSelector(s => s.auth.mode === 'dark');

  return (
    <RawComp
      title={title}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText={okText}
      footer={footer}
      cancelButtonProps={{style: {display: 'none'}}}
      className={cx(className, {'darkModal': darkMode})}
      {...props}
    >
      {props.children}
    </RawComp>
  )
};

export default Modal;
