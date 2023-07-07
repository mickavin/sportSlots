import React from 'react';
import {CircularProgressbar} from 'react-circular-progressbar';

const CircularProgress = ({percentage, size, strokeWidth}) => {
  const style = React.useMemo(() => ({width: size || 45}), [size]);

  return <div style={style}><CircularProgressbar value={percentage} text={`${percentage}%`} strokeWidth={strokeWidth || 4} /></div>;
};

export default CircularProgress;
