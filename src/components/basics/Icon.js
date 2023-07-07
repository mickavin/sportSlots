import React from 'react';

const Icon = ({name, color, size}) => {
  const styles = React.useMemo(() => ({color, fontSize: size}), []);

  return <i className={"icon-" + name} style={styles} />
};

export default Icon;
