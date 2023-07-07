import React from 'react';
import {Row, Tag, Col} from 'antd';
import {Button, Input, Select} from "./index";
import {capitalizeFirstLetter, getTemptId} from "../utils/helpers";

const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple']
  .map(c => ({value: c, label: capitalizeFirstLetter(c)}));

const TagPicker = ({tags = [], onChange}) => {
  const [name, setName] = React.useState('');
  const [color, setColor] = React.useState('');

  const onCreate = React.useCallback(() => {
    onChange([...tags, {_id: getTemptId(), name, color}]);
    setName('');
    setColor('');
  }, [name, color]);

  return (
    <div className="tagPicker">
      <Row gutter={12}>
        <Col xs={10}><Input placeholder="Name" value={name} onChange={setName}/></Col>
        <Col xs={8}><Select placeholder="Color" value={color} onChange={setColor} options={colors}/></Col>
        <Col xs={6}><Button title="Add" onClick={onCreate}/></Col>
      </Row>
      <div className="content">
        {tags.map(tag => <Tag key={tag.name} color={tag.color} closable onClose={() => onChange(tags.filter(t => t._id !== tag._id))}>{tag.name}</Tag>)}
      </div>
    </div>
  );
};

export default TagPicker;
