import React from 'react';
import {Button, Checkbox, Icon, Input, PopConfirm, Progress} from "../../../../components";
import {Row, Col} from "antd";
import {getTemptId} from "../../../../utils/helpers";
import {useDispatch} from "react-redux";
import {createTaskTodo, deleteTaskTodo, deleteTodoGroup, updateTaskTodo, updateTodoGroup} from "../../actions";

const TodoSection = ({todo}) => {
  if (todo) return <div>{todo.map(todo => <TodoList key={todo._id} todo={todo}/>)}</div>;
  else return null;
};

export default TodoSection;

const TodoList = ({todo}) => {
  const [title, setTitle] = React.useState(todo.title);
  const [titleEdit, setTitleEdit] = React.useState(false);
  const [newTodoTxt, setNewTodoTxt] = React.useState('');
  const [inputVisible, setInputVisible] = React.useState(false);
  const dispatch = useDispatch();

  const updateGroupTitle = React.useCallback(() => {
    if (!title) return;
    dispatch(updateTodoGroup({id: todo._id, title}));
    setTitleEdit(false);
  }, [todo._id, title]);

  const updateTodo = React.useCallback((todoId, itemId, value) => {
    dispatch(updateTaskTodo({todoGroupId: todoId, todoId: itemId, data: value}));
  }, []);

  const addTodo = React.useCallback(todoId => {
    if (!newTodoTxt) return;
    const newItem = {_id: getTemptId(), text: newTodoTxt};
    dispatch(createTaskTodo({todoGroupId: todoId, ...newItem}));
    setNewTodoTxt('');
  }, [newTodoTxt]);

  const deleteTodo = React.useCallback((todoId, itemId) => {
    dispatch(deleteTaskTodo({groupId: todoId, todoId: itemId}));
  }, []);

  const deleteTodoList = React.useCallback((todoId) => {
    dispatch(deleteTodoGroup(todoId))
  }, []);

  const onKeyDown = React.useCallback((e, todoId) => {
    if (e.key === 'Enter') {
      if (todoId) addTodo(todoId);
      else updateGroupTitle();
    }
  }, [newTodoTxt, title]);

  return (
    <div className="todo" key={todo._id}>
      <Row align="middle" className="title">
        <Row>
          <Col>
            <Icon name="todo"/>
          </Col>
          <Col>
            {titleEdit ?
              <Input placeholder="Title..." value={title} onChange={setTitle} onKeyDown={e => onKeyDown(e, false)} onBlur={updateGroupTitle} autoFocus/> :
              <div onClick={() => setTitleEdit(true)}>{todo.title}</div>
            }
          </Col>
        </Row>
        <PopConfirm
          title="Are you sure to delete the todo list"
          onConfirm={() => deleteTodoList(todo._id)}
          content={<div className="delete"><Icon name="delete"/></div>}
        />
      </Row>
      <Progress percent={(todo.list.filter(l => l.checked).length / todo.list.length) * 100} color="#48B990"/>
      <div className="list">
        {todo.list.map(item =>
          <TodoItem key={item._id} item={item} todoId={todo._id} updateTodo={updateTodo} deleteTodo={() => deleteTodo(todo._id, item._id)}/>
        )}
      </div>
      {inputVisible ?
        <div className="inputContainer">
          <Input placeholder="New todo" value={newTodoTxt} onChange={setNewTodoTxt} autoFocus onKeyDown={e => onKeyDown(e, todo._id)}/>
          <Row align="middle">
            <Button onClick={() => addTodo(todo._id)} block={false}>Add</Button>
            <div className="cancel" onClick={() => setInputVisible(false)}>Cancel</div>
          </Row>
        </div>
        :
        <Button className="itemBtn" type="default" onClick={() => setInputVisible(true)}>New Item</Button>
      }
    </div>
  )
};

export const TodoItem = ({item, todoId, updateTodo, deleteTodo}) => {
  const [inputVisible, setInputVisible] = React.useState(false);
  const [text, setText] = React.useState(item.text);

  const updateData = React.useCallback(val => {
    updateTodo(todoId, item._id, val)
  }, [item, todoId, updateTodo, text]);

  const updateText = React.useCallback(() => {
    if (text) {
      updateData({text});
      setInputVisible(false);
    }
  }, [text]);

  const onKeyDown = React.useCallback(e => {
    if (e.key === 'Enter') updateText();
  }, [text]);

  return (
    <Row className="item" align="middle">
      <Checkbox value={item.checked} onChange={checked => updateData({checked})}/>
      <div className="text" onClick={() => setInputVisible(true)}>
        {!inputVisible ?
          <div>
            {item.text}
            <div className="delete" onClick={e => {deleteTodo(); e.stopPropagation()}}><Icon name="delete"/></div>
          </div>
          :
          <Input placeholder="Todo..." value={text} onChange={setText} onKeyDown={onKeyDown} onBlur={updateText} autoFocus/>
        }
      </div>
    </Row>
  )
};
