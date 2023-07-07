import React from 'react';
import {Button, Icon, Input, PopConfirm, Popover, Select, UploadWrapper, UserSearch} from "../../../../components";
import MemberOptionItem from "../../../../components/MemberOptionItem";
import TagPicker from "../../../../components/TagPicker";
import {getTemptId, mapFileData} from "../../../../utils/helpers";
import {toast} from "react-toastify";
import {DatePicker} from 'antd';
import {moment} from "../../../../utils/moment";
import {useDispatch, useSelector} from "react-redux";
import {archiveTask, createTaskAttachment, createTodoGroup, deleteTask, duplicateBoard, unarchiveTask, updateTask} from "../../actions";
import {createNotification} from "../../../dashboard/actions";

const boards = [{value: '1', label: 'Todo'}, {value: '2', label: 'On Progress'}, {value: '3', label: 'On Review'}, {value: '4', label: 'Done'}];

const ActionList = ({task, project, setBoards, closeModal, updateData}) => {
  const [todoTitle, setTodoTitle] = React.useState('');
  const [dateVisible, setDateVisible] = React.useState(false);
  const [name, setName] = React.useState('');
  const userId = useSelector(s => s.auth.user.data._id);
  const dispatch = useDispatch();

  const changeBoard = React.useCallback((newBoard) => {
    setBoards(s => {
      const newIndex = s[newBoard].length;
      dispatch(updateTask({data: {board: newBoard, index: newIndex}}));
      return {
        ...s, [task.board]: s[task.board].filter(t => t._id !== task._id),
        [newBoard]: [...s[newBoard], {...task, board: newBoard}]
      };
    });
  }, [task]);

  const duplicate = React.useCallback(() => {
    const newItem = {...task, _id: getTemptId()};
    setBoards(s => ({...s, [task.board]: [...s[task.board], newItem]}));
    dispatch(duplicateBoard(newItem));
    toast.success('Task duplicated')
  }, [task]);

  const archive = React.useCallback(() => {
    setBoards(s => ({...s, [task.board]: s[task.board].filter(t => t._id !== task._id)}));
    dispatch(archiveTask([task._id]));
    closeModal();
    toast.success('Task archived');
  }, [task]);
  const unarchive = React.useCallback(() => {
    dispatch(unarchiveTask([task._id]));
  }, [task]);

  const removeTask = React.useCallback(() => {
    setBoards(s => ({...s, [task.board]: s[task.board].filter(t => t._id !== task._id)}));
    dispatch(deleteTask([task._id]));
    closeModal();
    toast.success('Task deleted')
  }, [task]);

  const addAttachment = React.useCallback(files => {
    const newFiles = files.map(file => ({...mapFileData(file), createdAt: new Date()}));
    dispatch(createTaskAttachment({data: newFiles, finalData: files, task: task._id}));
  }, [task._id]);

  const updateEndDate = React.useCallback(date => {
    updateData(() => ({endDate: moment(date).format()}));
  }, []);

  const addTodo = React.useCallback(() => {
    if (todoTitle) {
      const newItem = {_id: getTemptId(), title: todoTitle, list: []};
      dispatch(createTodoGroup(newItem));
      setTodoTitle('');
    }
  }, [todoTitle]);

  const addMember = React.useCallback(item => {
    const userItem = project.members.map(m => m.user).find(u => u._id === item.value);
    const finalData = {members: [...(task.members?.map(m => m._id)||[]), item.value]};
    updateData(s => ({members: [...(s.members||[]), userItem]}), finalData);
    if (userId !== item.value && !project.mutedBy?.includes(item.value))
      dispatch(createNotification({user: item.value, title: `You have been assigned to task "${task.title.substring(0, 10)}"`}));
  }, [task.members, userId, project.mutedBy]);

  const removeMember = React.useCallback(id => {
    const finalData = {members: task.members?.filter(m => m._id !== id).map(m => m._id)};
    updateData((s => ({members: s.members?.filter(m => m._id !== id)})), finalData);
  }, [task.members]);

  return (
    <div className="actionList">
      <Popover
        title="Members"
        button={<div className="item"><Icon name="user"/> Members</div>}
        content={<div className="popoverContent">
          <UserSearch addedItems={task.members} onSelect={val => addMember(val)} value={name} onChange={setName} task/>
          {task.members?.map(item => <MemberOptionItem key={item._id} item={item} onDelete={()=> removeMember(item._id)}/>)}
        </div>}
      />
      <Popover
        title="Tags"
        button={<div className="item"><Icon name="tag"/> Tags</div>}
        content={<div className="popoverContent tagPopover">
          <TagPicker tags={task.tags} onChange={tags => updateData(() => ({tags}))}/>
        </div>}
      />
      <div className="datePicker">
        <DatePicker
          open={dateVisible}
          showTime={{format: 'HH:mm'}}
          format="YYYY-MM-DD HH:mm"
          onChange={updateEndDate}
          defaultValue={moment(task.endDate)}
          onOk={() => setDateVisible(false)}
        />
      </div>
      <div className="item" onClick={() => setDateVisible(!dateVisible)}><Icon name="time"/> Date</div>
      <UploadWrapper onChange={addAttachment} multiple>
        <div className="item"><Icon name="attachment"/> Attachment</div>
      </UploadWrapper>
      <Popover
        title="Todo List"
        button={<div className="item"><Icon name="todo"/>Todo List</div>}
        content={<div className="popoverContent">
          <Input placeholder="Todo Title" value={todoTitle} onChange={setTodoTitle} autoFocus onKeyDown={e => e.key === 'Enter' && addTodo()}/>
          <Button title="Add List" onClick={addTodo}/>
        </div>}
      />
      <br/>
      <Popover
        title="Move to"
        button={<div className="item"><Icon name="arrow-right"/> Move to</div>}
        content={<div className="popoverContent">
          <Select placeholder="Board" value={task.board.toString()} options={boards} onChange={changeBoard}/>
        </div>}
      />
      <div className="item" onClick={duplicate}><Icon name="duplicate"/> Duplicate</div>
      {!task.archived ?
        <PopConfirm
          title="Are you sure to archive this task?"
          onConfirm={archive}
          content={<div className="item"><Icon name="archive"/> Archive</div>}
        /> :
        <div onClick={unarchive} className="item"><Icon name="rotate"/> Unarchive</div>
      }
      <PopConfirm
        title="Are you sure to delete this task?"
        onConfirm={removeTask}
        content={<div className="item danger"><Icon name="delete"/> Delete</div>}
      />
    </div>
  );
};

export default ActionList;
