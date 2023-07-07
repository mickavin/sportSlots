import React from 'react';
import {Progress as RawComp} from "antd";

const Progress = ({percent, info = false, size, color}) =>
  <RawComp percent={percent} showInfo={info} style={size} strokeColor={color}/>;

export default Progress;
