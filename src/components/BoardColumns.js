import React from 'react';
import {Droppable, Draggable, DragDropContext} from "react-beautiful-dnd";
import {Row, Col, Tag} from 'antd';
import cx from 'classnames';
import {Button, Card, Icon, Input, MemberList, PopConfirm, Popover} from "./index";
import {moment} from "../utils/moment";
import Progress from "./basics/Progress";
import {archiveTask, deleteTask} from "../pages/Project/actions";
import {useDispatch} from "react-redux";
import {fixImgPath} from "../utils/helpers";

const BoardColumns = ({boards, onDragEnd, createTask, setTask, setBoards, setArchivedTasksVisible, loading}) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="boardWrapper" style={{height: window.innerHeight - 100}}>
        <div className="boardContainer">
          <Row gutter={20} style={{height: window.innerHeight - 100}}>
            {["1", "2", "3", "4"].map((column, index) => {
              return(
                <Col xs={6} key={index}>
                  <div className="column">
                    <Row align="middle" justify="space-between" className="title">
                      <Row align="middle">
                        <div className={cx('badge', {blue: column == 2, orange: column == 3, green: column == 4})}/>
                        {column == 1 ? 'Todo' : column == 2 ? 'On Progress' : column == 3 ? 'On Review' : 'Done'}
                      </Row>
                      {!loading && <ColumnMenu setBoards={setBoards} setArchivedTasksVisible={setArchivedTasksVisible} column={column} tasks={boards[column]}/>}
                    </Row>
                    {loading ? <Card className="noBorder" loading minHeight={100}/> :
                      <>
                        <ColElement data={boards[column]} id={column} setTask={setTask}/>
                        <ColumnFooter createTask={title => createTask(column, title)}/>
                      </>
                    }
                  </div>
                </Col>
              )
            })}
          </Row>
        </div>
      </div>
    </DragDropContext>
  )
};

const ColumnMenu = ({setBoards, setArchivedTasksVisible, column, tasks}) => {
  const [menuVisible, setMenuVisible] = React.useState();
  const dispatch = useDispatch();
  const handleOperations = (val) => {
    const taskIds = tasks.map(t => t._id);
    if (val === 1) dispatch(archiveTask(taskIds));
    if (val === 2) dispatch(deleteTask(taskIds));
    setBoards(s => ({...s, [column]: []}));
    setMenuVisible(false);
  };
  const menu = React.useMemo(() => {
    const archiveLabel = <PopConfirm
      title="Are you sure to archive all tasks?"
      onConfirm={() => handleOperations(1)}
      content={<div>Archive all</div>}
    />;
    const deleteLabel = <PopConfirm
      title="Are you sure to delete all tasks?"
      onConfirm={() => handleOperations(2)}
      content={<div>Delete all</div>}
    />;
    return [
      {value: 1, label: archiveLabel}, {value: 2, label: deleteLabel},
      {value: 3, label: <div onClick={() => {setArchivedTasksVisible(true); setMenuVisible(false)}}>Archived tasks</div>}]
  }, [column, tasks]);
  return <Popover
    menu={menu}
    button={<div className="setting"><Icon name="dots-horizontal"/></div>}
    onVisibleChange={setMenuVisible} visible={menuVisible}/>;
};

const ColElement = ({id, data, setTask}) => {
  const maxHeight = window.innerHeight - 200;
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div className="columnInner" {...provided.droppableProps} ref={provided.innerRef} style={{maxHeight}}>
          {data.map((task, index) => (
            <DragItem key={task._id} task={task} i={index} setTask={setTask}/>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
};

const DragItem = ({task, setTask, i}) => {
  const {members, endDate, comments, attachments, tags, todoGroup} = task;
  const image = attachments?.find(item => item.type?.includes('image'))?.src;
  const progress = React.useMemo(() => {
    if (todoGroup?.length) {
      let total = 0;
      let checked = 0;
      todoGroup.forEach(t => {total += t.list.length; t.list.forEach(l => {if (l.checked) checked += 1})});
      return (checked / total) * 100;
    }
  }, [todoGroup]);
  return (
    <Draggable draggableId={task._id} index={i}>
      {(provided, snapshot) => (
        <div className="taskCard cardContainer" ref={provided.innerRef} {...provided.draggableProps}{...provided.dragHandleProps}>
          <div className={cx('card', {'drag': snapshot.isDragging && !snapshot.isDropAnimating})} onClick={() => setTask(task)}>
            <div className="cardTitle">{task.title}</div>
            {image && <div className="imageContainer"><img src={fixImgPath(image)} alt="" className="cardImage"/></div>}
            {!!progress && <div className="progressContainer"><Progress percent={progress} color="#48B990"/></div>}
            {!!tags?.length && <Row gutter={10} className="tags">
              {tags.map(tag => <Tag key={tag._id} color={tag.color}>{tag.name}</Tag>)}
            </Row>}
            {members?.length || endDate || comments?.length || attachments?.length ?
              <Row justify="space-between" align="middle" className="cardFooter">
                {!!members?.length ? <MemberList members={members} size={25}/> : <div/>}
                <Row className="footerRight" align="middle">
                  {endDate && <div><Icon name="time" size={15}/> {moment(endDate).format('DD MMM')}</div>}
                  {comments?.length && <div><Icon name="comments"/> {comments.length}</div>}
                  {attachments?.length && <div><Icon name="attachment"/> {attachments.length}</div>}
                </Row>
              </Row> : null
            }
          </div>
        </div>
      )}
    </Draggable>
  );
};

const ColumnFooter = (props) => {
  const [inputVisible, setInputVisible] = React.useState(false);
  const [taskTitle, setTaskTitle] = React.useState('');

  const closeInput = React.useCallback(() => {
    setInputVisible(false);
    setTaskTitle('')
  }, []);

  const createTask = React.useCallback(() => {
    if (taskTitle) {
      props.createTask(taskTitle);
      closeInput();
    }
  }, [taskTitle]);

  return (
    <>
      {inputVisible ? <Row className="addTask inputContainer" align="middle" justify="center">
          <Input placeholder="Type a title for this task…" value={taskTitle} onChange={setTaskTitle}
                 onKeyDown={e => e.key === 'Enter' && createTask()} autoFocus/>
          <Row align="middle">
            <Button title="Add Task" onClick={createTask}/>
            <div onClick={closeInput}><Icon name="close"/></div>
          </Row>
        </Row>
        :
        <Row className="addTask" align="middle" justify="center" onClick={() => setInputVisible(true)}>
          <div className="plusContainer">
            <Icon name="plus"/>
          </div>
          <div>New Task</div>
        </Row>
      }
    </>
  )
};

export default BoardColumns;
