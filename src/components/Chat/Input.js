import React from 'react';
import {Icon, UploadWrapper} from "../index";
import {axios} from "../../config";
import {getFileName} from "../../utils/helpers";

const ChatInput = ({onChange, value, appendMessage, onSend, chatId}) => {
  const submit = React.useCallback(async () => {
    if (value) {
      sendMessage({text: value});
      onChange('');
    }
  }, [value]);

  const sendMessage = React.useCallback((data) => {
    appendMessage(data);
    onSend(data, chatId);
  }, [chatId]);

  const uploadFile = React.useCallback(async file => {
    const form = new FormData();
    form.append('file', file);
    const res = await axios.post('/chat/file', form);
    return res.data.path;
  }, []);

  const sendFile = React.useCallback(async (source) => {
    const uri = window.URL.createObjectURL(source);
    const type = source.type.includes('image') ? 'image' : 'file';
    let data = {[type]: uri};
    if (type === 'file')
      data = {...data, fileName: getFileName(source.name)};
    appendMessage(data);
    data[type] = await uploadFile(source);
    onSend(data, chatId);
  }, [chatId]);

  return (
    <div className="chatInput">
      <input
        type="text"
        value={value}
        placeholder={"Message..."}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && submit()}
      />
      <UploadWrapper onChange={sendFile}>
        <div className="icon attachment">
          <Icon name="attachment"/>
        </div>
      </UploadWrapper>
      <div className="icon" onClick={submit}>
        <Icon name="send"/>
      </div>
    </div>
  );
};

export default ChatInput;
