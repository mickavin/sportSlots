import React from 'react';
import {fixImgPath, getExt, humanFileSize, mapFileData, openFile} from "../../../../utils/helpers";
import {Row, Image} from "antd";
import {moment} from "../../../../utils/moment";
import {Button, Icon, PopConfirm, UploadWrapper} from "../../../../components";
import {useDispatch} from "react-redux";
import {createTaskAttachment, deleteTaskAttachment} from "../../actions";

const AttachmentSection = ({task}) => {
  const dispatch = useDispatch();

  const addAttachment = React.useCallback(files => {
    const newFiles = files.map(file => ({...mapFileData(file), createdAt: new Date()}));
    dispatch(createTaskAttachment({data: newFiles, finalData: files, task: task._id}));
  }, [task._id]);

  const removeAttachment = React.useCallback(id => {
    dispatch(deleteTaskAttachment({task: task._id, attachment: id}));
  }, [task._id]);

  if (task.attachments?.length) {
    return (
      <div className="attachments">
        <Row align="middle" className="title"><Icon name="attachment"/> Attachments</Row>
        {task.attachments.map(item => <Row className="attachmentItem" align="middle" key={item._id}>
          <div className="thumbnail" onClick={() => openFile(item.src, item.type)}>
            {item.type === 'image/png' || item.type === 'image/jpeg' ?
              <AttachmentImage src={fixImgPath(item.src)}/>
              :
              <div>{getExt(item.type)}</div>
            }
          </div>
          <div className="info">
            <div className="name ellipsis" onClick={() => openFile(item.src, item.type)}>{item.name}</div>
            <div>{humanFileSize(item.size)} - {moment(item.createdAt).format('DD MMM')}</div>
          </div>
          <PopConfirm
            title="Are you sure to delete this task?"
            onConfirm={() => removeAttachment(item._id)}
            content={<div className="delete danger"><Icon name="delete"/></div>}
          />
        </Row>)}
        <UploadWrapper multiple onChange={addAttachment}>
          <Button className="itemBtn" type="default">New Item</Button>
        </UploadWrapper>
      </div>
    );
  }
  else return null;
};

const AttachmentImage = ({src}) => {
  const [visible, setVisible] = React.useState(false);
  return (
    <>
      <div className="img" style={{backgroundImage: `url(${src})`}} onClick={() => setVisible(true)}/>
      <Image src={src} style={{display: 'none'}} preview={{visible, src, onVisibleChange: setVisible}}/>
    </>
  )
};

export default AttachmentSection;
