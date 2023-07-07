import React from 'react';
import {Upload as RawComp} from "antd";
import {Icon, Spinner} from "../index";

const Upload = ({listType, onChange, showUploadList, loading, preview, ...props}) => {
  return (
    <RawComp
      listType="picture-card"
      showUploadList={showUploadList || false}
      onChange={onChange}
      disabled={loading}
      beforeUpload={() => false}
      {...props}
    >
      {preview ?
        <img src={preview} style={{width: '100%'}} alt=""/>
        :
        <div>
          {loading ? <Spinner /> : <Icon name="plus" />}
          <div className="text">Upload</div>
        </div>}
    </RawComp>
  )
};

export default Upload;
