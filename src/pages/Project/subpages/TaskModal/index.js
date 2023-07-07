import React from 'react';
import {Icon, Input, MemberList, Modal} from "../../../../components";
import {Row, Col, Tag} from "antd";
import {moment} from "../../../../utils/moment";
import {Textarea} from "../../../../components/basics/Input";
import {useDispatch, useSelector} from "react-redux";
import TodoSection from "./TodoSection";
import ActionList from "./ActionList";
import CommentSection from "./CommentSection";
import AttachmentSection from "./AttachmentSection";
import {getTask, setTaskDetail, updateTask} from "../../actions";

const TaskModal = ({visible, data, setBoards, close}) => {
  const [title, setTitle] = React.useState('');
  const [titleEdit, setTitleEdit] = React.useState(false);
  const [desc, setDesc] = React.useState('');
  const [descEdit, setDescEdit] = React.useState(false);
  const user = useSelector(s => s.auth.user.data);
  const project = useSelector(s => s.project.project.data);
  const task = useSelector(s => s.project.taskDetail.data);
  const taskLoading = useSelector(s => s.project.taskDetail.loading);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (visible) {
      if (typeof data !== 'string') {
        dispatch(setTaskDetail({...data}));
        setTitle(data.title);
      }
      getData();
    } else
      dispatch(setTaskDetail(null));
  }, [visible]);

  const getData = React.useCallback(() => {
    const id = typeof data === 'string' ? data : data._id;
    dispatch(getTask(id));
  }, [data, project._id]);

  React.useEffect(() => {
    if (!taskLoading && !task) {
      window.history.replaceState(null, "", `/project/${project._id}/board`);
      close();
    } else if (!taskLoading && task) {
      setTitle(task.title);
      setDesc(task.desc);
    }
  }, [project._id, task, taskLoading]);

  const updateData = React.useCallback((newValue, finalData) => {
    dispatch(updateTask({data: newValue(task), finalData}));
  }, [task]);

  const updateTitle = React.useCallback(() => {
    if (title) {
      updateData(() => ({title}));
      setTitleEdit(false);
    }
  }, [title]);

  const modalTitle = React.useMemo(() => <div>
    {!titleEdit ? <div onClick={() => setTitleEdit(true)}>{title}</div> :
      <Input placeholder="Title" value={title} onChange={setTitle} onBlur={updateTitle} className="taskTitleInput" autoFocus/>}
  </div>, [title, titleEdit]);

  return (
    <Modal visible={visible} title={modalTitle} footer={null} className="taskModal" onCancel={close}>
      {task?._id ?
        <Row gutter={20}>
          <Col sm={18} xs={24}>
            {!(task.members?.length || task.endDate || task.comments?.length || task.attachments?.length) && <div style={{marginBottom: -20}}/>}
            <Row>
              {!!task.members?.length ? <div className="taskMembers"><MemberList members={task.members}/></div> : <div/>}
              <Row className="info" align="middle">
                {task.endDate && <div><Icon name="time" size={15}/> {moment(task.endDate).format('DD MMM - HH:mm')}</div>}
                {task.comments?.length && <div><Icon name="comments"/> {task.comments.length}</div>}
                {task.attachments?.length && <div><Icon name="attachment"/> {task.attachments.length}</div>}
              </Row>
            </Row>
            {!!task.tags?.length ? <Row gutter={10} className="tags">
              {task.tags.map(tag => <Tag key={tag._id} color={tag.color}>{tag.name}</Tag>)}
            </Row> : <div className="space"/>}
            <div className="desc">
              <Row align="middle" className="title"><Icon name="description"/> Description</Row>
              {descEdit || !desc?.replace(/ /g, '') ?
                <Textarea
                  placeholder="Add a description..."
                  value={desc}
                  onChange={val => {setDescEdit(true); setDesc(val)}}
                  onBlur={() => {setDescEdit(false); updateData(() => ({desc}))}}
                  autoSize
                  autoFocus={descEdit}
                  onKeyDown={e => e.key === 9 && e.preventDefault()}
                />
                : <p onClick={() => setDescEdit(true)}>{desc}</p>
              }
            </div>
            {!taskLoading && <>
              <TodoSection todo={task.todoGroup}/>
              <AttachmentSection task={task}/>
              <CommentSection user={user} task={task}/>
            </>}
          </Col>
          <Col sm={6} xs={24}>
            <ActionList task={task} project={project} setBoards={setBoards} closeModal={close} updateData={updateData}/>
          </Col>
        </Row> : null
      }
    </Modal>
  )
};

export default TaskModal;
