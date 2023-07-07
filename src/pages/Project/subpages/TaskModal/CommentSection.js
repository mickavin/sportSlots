import React from 'react';
import {Image, Row} from "antd";
import {Avatar, Button, Icon, PopConfirm, UploadWrapper} from "../../../../components";
import cx from "classnames";
import {Textarea} from "../../../../components/basics/Input";
import {moment} from "../../../../utils/moment";
import useOutsideAlerter from "../../../../utils/useOutsideAlerter";
import {fixImgPath, getExt, getTemptId, humanFileSize, isImg, mapFileData, openFile} from "../../../../utils/helpers";
import {useDispatch} from "react-redux";
import {createComment, deleteComment, deleteCommentAttachment, updateComment} from "../../actions";

const CommentSection = ({user, task}) => {
  const [comment, setComment] = React.useState('');
  const [files, setFiles] = React.useState([]);
  const [onComment, setOnComment] = React.useState(false);
  const dispatch = useDispatch();
  const commentInputRef = React.useRef(null);
  useOutsideAlerter(commentInputRef, () => setOnComment(false));

  const addComment = React.useCallback(e => {
    const finalData = {content: comment, task: task._id, attachments: files};
    const data = {user, _id: getTemptId(), content: comment, attachments: files.map(mapFileData), createdAt: new Date()};
    dispatch(createComment({finalData, data}));
    setComment('');
    setFiles([]);
    setOnComment(false);
    e.stopPropagation();
  }, [comment, files, task]);

  const updateCommentFunc = React.useCallback((id, content) => {
    dispatch(updateComment({id, data: {content}}));
  }, []);

  const deleteCommentFunc = React.useCallback(id => {
    dispatch(deleteComment(id));
  }, [task.comments]);

  const deleteCommentFile = React.useCallback((commentId, fileId) => {
    dispatch(deleteCommentAttachment({comment: commentId, attachmentId: fileId}));
  }, [task.comments]);

  return (
    <div className="comments">
      <Row align="middle" className="title"><Icon name="comments"/> Comments</Row>
      <Row>
        <Avatar src={user.avatar} name={user.firstName} />
        <div className={cx('inputContainer', {active: onComment})} onClick={() => setOnComment(true)} ref={commentInputRef}>
          <Textarea placeholder="Type a comment..." value={comment} onChange={setComment}/>
          {onComment &&
          <>
            <Row className="fileList">
              {files.map(mapFileData).map(file =>
                <div
                  key={file._id}
                  className="fileItem"
                  style={isImg(file) ? {backgroundImage: `url(${file.src})`} : {}}
                >
                  <div onClick={() => setFiles(files.filter(f => f.name !== file.name))} className="close"><Icon name="close"/></div>
                </div>
              )}
            </Row>
            <Row className="inputFooter" align="middle">
              <UploadWrapper onChange={d => setFiles(d)} multiple>
                <Icon name="attachment"/>
              </UploadWrapper>
              <Button disabled={!comment} onClick={addComment}>Save</Button>
            </Row>
          </>
          }
        </div>
      </Row>
      {task.comments && [...task.comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(comment =>
        <CommentItem
          key={comment._id}
          comment={comment}
          user={user}
          updateComment={updateCommentFunc}
          deleteComment={deleteCommentFunc}
          deleteCommentFile={deleteCommentFile}
        />
      )}
    </div>
  );
};

const CommentItem = ({comment, user, updateComment, deleteComment, deleteCommentFile}) => {
  const [edit, setEdit] = React.useState(false);
  const [text, setText] = React.useState(comment.content);

  const updateItem = React.useCallback(e => {
    updateComment(comment._id, text);
    setEdit(false);
    e.stopPropagation()
  }, [text]);

  return (
    <div className="commentItem">
      <Row>
        <Avatar src={comment.user.avatar} name={comment.user.firstName}/>
        <div className="contentContainer">
          <Row align="middle">
            <div className="name">{comment.user.firstName}</div>
            <div className="date">{moment(comment.createdAt).fromNow()}</div>
            {comment.user._id === user._id ?
              <Row className="actions" align="middle">
                <div onClick={() => setEdit(true)}><Icon name="edit"/></div>
                <PopConfirm
                  content={<div className="danger"><Icon name="delete"/></div>}
                  title="Are you sure to delete this comment?"
                  onConfirm={() => deleteComment(comment._id)}
                />
              </Row> : null
            }
          </Row>
          {edit ?
            <div className="inputContainer active editContainer">
              <Textarea placeholder="Type a comment..." value={text} onChange={setText}/>
              <Row className="inputFooter" align="middle">
                <div className="cancel" onClick={() => {setText(comment.content); setEdit(false)}}>Cancel</div>
                <Button disabled={!comment} onClick={updateItem}>Save</Button>
              </Row>
            </div>
            :
            <div>
              <div className="content">
                {comment.content}
                {!!comment.attachments?.length && <Row className="attachments">
                  {comment.attachments.map(file =>
                    <div className="attachmentItem" key={file._id}>
                      <div className="thumbnail" onClick={() => openFile(file.src, file.type)}>
                        <PopConfirm
                          content={<div className="close"><Icon name="close"/></div>}
                          title="Are you sure to delete this attachment?"
                          onConfirm={() => deleteCommentFile(comment._id, file._id)}
                        />
                        {isImg(file) ?
                          <AttachmentImage src={file.src}/>
                          :
                          <div>{getExt(file.type)}</div>
                        }
                      </div>
                      <div className="info">
                        <div className="name ellipsis" onClick={() => openFile(file.src, file.type)}>{file.name}</div>
                        <div>{humanFileSize(file.size)} - {moment(file.createdAt).format('DD MMM')}</div>
                      </div>
                    </div>
                  )}
                </Row>}
              </div>
            </div>
          }
        </div>
      </Row>
    </div>
  )
};

export default CommentSection;

const AttachmentImage = ({src}) => {
  const [visible, setVisible] = React.useState(false);
  return (
    <>
      <div className="img" style={{backgroundImage: `url(${fixImgPath(src)})`}} onClick={() => setVisible(true)}/>
      <Image src={fixImgPath(src)} style={{display: 'none'}} preview={{visible, src: fixImgPath(src), onVisibleChange: setVisible}}/>
    </>
  )
};
