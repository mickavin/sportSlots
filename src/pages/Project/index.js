import React from 'react';
import {Col, Row} from "antd";
import {Card, Icon, ProjectHead, ProjectMembers} from "../../components";
import {useDispatch, useSelector} from "react-redux";
import CircularProgress from "../../components/basics/CircularProggress";
import {getTemptId} from "../../utils/helpers";
import NoteItem from "../../components/NoteItem";
import {TodoItem} from "./subpages/TaskModal/TodoSection";
import {moment} from "../../utils/moment";
import { useRouter } from 'next/router';
import {createNote, createTodo, deleteTodo, getNotes, getTodo, updateNote, updateTodo, getProjectHistory, deleteNote} from "./actions";
import getStatistics from "../../utils/getStatistics";

const Project = () => {
  const router = useRouter()
  const project = useSelector(s => s.project.project);
  const todo = useSelector(s => s.project.todo);
  const notes = useSelector(s => s.project.notes);
  const tasks = useSelector(s => s.project.taskList);
  const dispatch = useDispatch();
  const {id} = router.query;

  React.useEffect(() => {
    dispatch(getNotes(id));
    dispatch(getTodo(id));
    dispatch(getProjectHistory(id));
  }, [id]);

  const addNote = React.useCallback(() => {
    if (!notes.creating) dispatch(createNote({_id: getTemptId(), text: 'New note', project: id}));
  }, [id, notes.creating]);
  const updateNoteItem = React.useCallback((id, val) => {
    dispatch(updateNote({...notes.data.find(t => t._id === id), ...val}))
  }, [notes.data]);

  const addTodo = React.useCallback(() => {
    if (!todo.creating) dispatch(createTodo({_id: getTemptId(), text: 'New todo', project: id}));
  }, [id, todo.creating]);
  const updateTodoItem = React.useCallback((n, id, val) => {
    dispatch(updateTodo({...todo.data.find(t => t._id === id), ...val}))
  }, [todo.data]);

  const NotesTitle = React.useMemo(() => <Row align="middle cardTitle">Notes <div onClick={addNote}>
    <Icon name="plus-circle"/></div></Row>, [id, notes.creating]);
  const TodoTitle = React.useMemo(() => <Row align="middle cardTitle">Todo <div onClick={addTodo}>
    <Icon name="plus-circle"/></div></Row>, [id, todo.creating]);

  const statistics = React.useMemo(() => getStatistics(tasks.filter(t => !t.archived)), [tasks]);

  return (
    <div className="projectHome">
      <ProjectHead/>
      <Row gutter={20} className="statistics">
        <Col xs={24} sm={12} md={6}>
          <Card minHeight={85}>
            <div>Todo Tasks</div>
            <b>{statistics.todo.size}</b>
            <div className="progress"><CircularProgress percentage={statistics.todo.percent} /></div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card minHeight={85}>
            <div>In Progress</div>
            <b>{statistics.inProgress.size}</b>
            <div className="progress"><CircularProgress percentage={statistics.inProgress.percent} /></div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card minHeight={85}>
            <div>In Review</div>
            <b>{statistics.inReview.size}</b>
            <div className="progress"><CircularProgress percentage={statistics.inReview.percent} /></div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card minHeight={85}>
            <div>Completed</div>
            <b>{statistics.completed.size}</b>
            <div className="progress"><CircularProgress percentage={statistics.completed.percent} /></div>
          </Card>
        </Col>
      </Row>
      <Row gutter={20} className="homeCards">
        <Col xs={24} md={12}>
          <Card title={NotesTitle} empty={!notes.data.length} loading={notes.loading} className="dashboardCard">
            {notes.data.map(note => <NoteItem key={note._id} note={note} updateItem={updateNoteItem} deleteNote={val => dispatch(deleteNote(val))}/>)}
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title={TodoTitle} empty={!todo.data.length} loading={todo.loading} className="todo dashboardCard">
            <div className="list">
              {todo.data.map(item =>
                <TodoItem
                  key={item._id}
                  item={item}
                  updateTodo={updateTodoItem}
                  deleteTodo={() => dispatch(deleteTodo(item._id))}
                />
              )}
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <ProjectMembers projectCard/>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Activity History" loading={project.loading} className="dashboardCard" empty={!project.data.history.length}>
            {project.data.history.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map(item => <div className="listItem" key={item._id}>
              <div>
                <div>{item.title}</div>
                <div className="historyDate">{moment(item.createdAt).format('DD MMM - HH:mm')}</div>
              </div>
            </div>)}
          </Card>
        </Col>
      </Row>
    </div>
  )
};

export default Project;
