import React from 'react';
import {Checkbox as RawComp} from "antd";

const Checkbox = ({value, onChange, ...props}) => {
  return (
    <RawComp checked={value} onChange={e => onChange(e.target.checked)} {...props} />
  )
};

export default Checkbox;
