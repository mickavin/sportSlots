import React from 'react';
import {Calendar as RawComp, Badge, Row, Col} from 'antd';
import {moment} from "../utils/moment";
import {Button, Icon, Input, Modal, Select} from "./index";
import {isDatesSame} from "../utils/helpers";

const Calendar = ({value, data, updateCalendar}) => {
  const [selectedDate, setSelectDate] = React.useState(null);
  const [status, setStatus] = React.useState('success');
  const [text, setText] = React.useState('');

  const dateCellRender = React.useCallback(date => {
    const dateOne = moment(date).format('YYYY-MM-DD');
    const dateData = data.find(d => isDatesSame(date, d.date));
    return (
      <div onClick={() => setSelectDate(dateData || {date: dateOne, notes: []})}>
        <div className="overlay"/>
        {dateData ? dateData.notes.map((n, i) => <Badge key={i} status={n.status} text={<span>{n.text}</span>} />) : null}
      </div>
    );
  }, [data]);

  const appendNote = React.useCallback(() => {
    const note = {status, text};
    setSelectDate(s => ({...s, notes: [...s.notes, note]}));
    setText('');
    let newData = [...data];
    const index = data.findIndex(d => isDatesSame(d.date, selectedDate.date));
    if (index > -1) newData = newData.map((d, i) => i === index ? {...d, notes: [...d.notes, note]} : d);
    else newData.push({date: selectedDate.date, notes: [note]});
    updateCalendar(newData);
  }, [text, status, selectedDate, data]);

  const removeNote = React.useCallback((noteIndex) => {
    let newData = [...data];
    const index = newData.findIndex(d => isDatesSame(d.date, selectedDate.date));
    if (index > -1) newData = newData.map((d, i) => i === index ? {...d, notes: d.notes.filter((n, i) => i !== noteIndex)} : d);
    setSelectDate(s => ({...s, notes: s.notes.filter((n, i) => i !== noteIndex)}));
    updateCalendar(newData);
  }, [data, selectedDate]);

  const statusList = ['Success', 'Error', 'Default', 'Processing', 'Warning'].map(s =>
    ({value: s.toLowerCase(), label: <Badge status={s.toLowerCase()} text={s} />}));

  return (
    <>
      <RawComp value={value} dateCellRender={dateCellRender}/>
      <Modal
        visible={selectedDate?.date}
        footer={null}
        onCancel={() => setSelectDate(null)}
        title={moment(selectedDate?.date).format('DD MMM YYYY')}
      >
        {!!selectedDate?.notes.length ?
          <>
            <p>Notes</p>
            {selectedDate?.notes.map((note, i) => <div key={i} className="noteItem">
              <Badge status={note.status} text={<>
                {note.text} <span className="remove" onClick={() => removeNote(i)}><Icon name="delete" /></span>
              </>} /> <br/>
            </div>)}
          </> : null
        }
        <br/>
        <p>Add Note</p>
        <Row gutter={10}>
          <Col xs={6}>
            <Select options={statusList} value={status} onChange={setStatus} placeholder="Status" />
          </Col>
          <Col xs={14}><Input placeholder="Note..." value={text} onChange={setText} /></Col>
          <Col xs={4}><Button title="Add" onClick={appendNote} disabled={!text.length} /></Col>
        </Row>
      </Modal>
    </>
  )
};

export default Calendar;
