import React from 'react';
import {Spin} from 'antd';

const Spinner = ({size, ...props}) => {
  return <Spin size={size} {...props} />
};

export default Spinner;
