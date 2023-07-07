import React from 'react';
import {Button as RawComp} from "antd";

const Button = ({onClick, title, type, loading, block=true, ...props}) => {
  return (
    <RawComp onClick={onClick} type={type || 'primary'} block={block} loading={loading} {...props}>
      {title || props.children}
    </RawComp>
  )
};

export default Button;
