import React from 'react';
import {Icon, Input} from "./index";

const NoteItem = ({note, updateItem, deleteNote}) => {
  const [isEdit, setEdit] = React.useState(false);
  const [text, setText] = React.useState(note.text);

  const close = React.useCallback(() => {
    setEdit(false);
    if (note.text !== note) updateItem(note._id, {text});
    else setText(note.text)
  }, [note.text, text]);

  return (
    <div className="listItem">
      {isEdit ?
        <Input autoFocus onBlur={close} value={text} onChange={setText} placeholder="Note"/>
        :
        <div className="text" onClick={() => setEdit(true)}>{note.text}</div>
      }
      <div className="delete" onClick={() => deleteNote(note._id)}><Icon name="delete"/></div>
    </div>
  )
};

export default NoteItem;
