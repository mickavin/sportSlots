import React from 'react';
import {AutoComplete as RawComp} from "antd";

const AutoComplete = ({onSelect, placeholder, options, onSearch, onChange, value}) => {
  const [opts, setOpts] = React.useState([]);

  React.useEffect(() => {
    setOpts([...options])
  }, [options]);

  return (
    <RawComp
      value={value}
      onSelect={val => {onSelect && onSelect(opts.find(o => o.value === val))}}
      placeholder={placeholder}
      options={opts}
      onSearch={txt => {
        onChange && onChange(txt);
        if (onSearch) onSearch(txt);
        else {
          setOpts(options.filter(o => o.label.toLowerCase().includes(txt.toLowerCase())))
        }
      }}
    />
  )
};

export default AutoComplete;
