import React from 'react';
import {Avatar as RawComp} from "antd";
import {fixImgPath, getNotNullFields} from "../../utils/helpers";

const Avatar = ({src, name, size, style}) => {
  const props = React.useMemo(() => ({src: fixImgPath(src)}), [src]);

  if (!src && !name) return null;

  return (
    <RawComp {...getNotNullFields(props)} size={size || 35}>
      {name && name[0]}
    </RawComp>
  )
};

export default Avatar;
