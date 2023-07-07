import React from 'react';
import {Select as RawComp} from "antd";
const {Option} = RawComp;

const Select = ({value, onChange, placeholder, options, mode, ...props}) => {
  return (
    <RawComp
      mode={mode}
      placeholder={placeholder}
      onChange={onChange}
      optionLabelProp="label"
      value={value}
      {...props}
    >
      {options.map(item => <Option key={item.value} value={item.value} label={item.label}>{item.label}</Option>)}
    </RawComp>
  )
};

export default Select;
