import React from 'react';
import {Popover as RawComp, Row} from 'antd';
import {useSelector} from "react-redux";
import cx from 'classnames';

const Popover = ({button, content, title, placement, menu, onItemSelect, visible, popoverStyle, ...props}) => {
  const darkMode = useSelector(s => s.auth.mode === 'dark');

  const menuContent = React.useMemo(() => menu ?
    <div className="popoverMenu" style={popoverStyle}>
      {menu.map(item =>
        <div key={item.value} onClick={() => onItemSelect && onItemSelect(item.value)} className="item">
          <Row align="middle">
            {item.image ? <img src={item.image} alt=""/> : null} <div className="ellipsis">{item.label}</div>
          </Row>
        </div>
      )}
    </div> : content
  , [menu, content]);

  return (
    <RawComp
      content={menuContent}
      title={title}
      visible={visible}
      trigger="click"
      placement={placement || 'bottom'}
      overlayClassName={cx({darkOverlay: darkMode})} {...props}
    >
      <div className="popoverBtn">{button}</div>
    </RawComp>
  )
};

export default Popover;
