import React from 'react';
import {Card as RawComp, Skeleton} from "antd";

const Card = ({title, loading, empty, minHeight, height, overflow, ...props}) => {
  return (
    <RawComp title={title} {...props} bodyStyle={{minHeight, height, overflow}}>
      <Skeleton loading={loading} active>
        {empty ? <div className="empty">
          <img src={require('../../images/empty.svg').default} alt=""/> <div>No Data</div>
        </div> : props.children}
      </Skeleton>
    </RawComp>
  )
};

export default Card;
