import React from 'react';
import {Row, Col} from "antd";
import {Card, Icon, ProjectCard} from "../../components";
import CircularProgress from "../../components/basics/CircularProggress";
import {useDispatch, useSelector} from "react-redux";
import {TodoItem} from "../Project/subpages/TaskModal/TodoSection";
import {getTemptId} from "../../utils/helpers";
import NoteItem from "../../components/NoteItem";
import {createNote, createTodo, deleteNote, deleteTodo, getNotes, getProjects, getTodo, updateNote, updateTodo} from "./actions";

const Dashboard = () => {

return (
    <div className="dashboard">
    </div>
  )
};

export default Dashboard;
