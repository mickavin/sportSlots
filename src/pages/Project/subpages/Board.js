import React from 'react';
import {ProjectHead} from "../../../components";
import BoardColumns from "../../../components/BoardColumns";
import {useDispatch, useSelector} from "react-redux";
import {getProjectTasks, newTask, setTaskItem, updateBoards} from "../actions";
import reorder from "../../../utils/reorder";
import {getNewBoards} from "../../../utils/mapBoardData";
import {getTemptId} from "../../../utils/helpers";
import TaskModal from "./TaskModal";
import {useParams} from "react-router-dom";
import ArchivedTasks from "./ArchivedTasks";

const ProjectBoard = () => {
  const [boards, setBoards] = React.useState();
  const [selectedTask, setSelectedTask] = React.useState(null);
  const [archivedTasksVisible, setArchivedTasksVisible] = React.useState(null);
  const [initialLoading, setInitialLoading] = React.useState(true);
  const tasks = useSelector(s => s.project.tasks);
  const newTaskItem = useSelector(s => s.project.newTaskItem);
  const taskDetail = useSelector(s => s.project.taskDetail);
  const dispatch = useDispatch();
  const {id, boardId} = useParams();

  React.useEffect(() => {
    dispatch(getProjectTasks());
  }, []);

  React.useEffect(() => {
    if (!Array.isArray(tasks.data)) setBoards({...tasks.data});
  }, [tasks.data]);

  React.useEffect(() => {
    if (boardId) setSelectedTask(boardId);
    setInitialLoading(false);
  }, [boardId]);

  React.useEffect(() => {
    const item = {...newTaskItem};
    if (newTaskItem) {
      setBoards(s => ({...s, [item.board]: s[item.board].map(t => t._id === item.tmpId ? {...newTaskItem} : t)}));
      dispatch(setTaskItem(null));
    }
  }, [newTaskItem]);

  React.useEffect(() => {
    if (!taskDetail.loading && taskDetail.data) {
      const item = {...taskDetail.data};
      setBoards(s => ({...s, [item.board]: s[item.board].map(t => t._id === item._id ? item : t)}));
    }
  }, [taskDetail]);

  React.useEffect(() => {
    if (!initialLoading) {
      const taskId = selectedTask ? typeof selectedTask === 'string' ? selectedTask : selectedTask._id : null;
      if (!taskId) window.history.replaceState(null, "", `/project/${id}/board`);
      else
        window.history.replaceState(null, "", `/project/${id}/board/${taskId}`);
    }
  }, [selectedTask, initialLoading]);

  const onDragEnd = React.useCallback((result) => {
    reorder(boards, result, data => {
      const {droppableId: oldBoard} = result.source;
      const {droppableId: newBoard} = result.destination;
      setBoards({...data, [newBoard]: data[newBoard].map(d => d._id === result.draggableId ? {...d, board: newBoard} : d)});
      const taskList = getNewBoards(data, oldBoard, newBoard);
      dispatch(updateBoards({data: taskList}));
    });
  }, [boards]);

  const createTask = React.useCallback((board, title) => {
    const task = {_id: getTemptId(), board: parseInt(board), title, order: boards[board].length};
    setBoards(s => ({...s, [board]: [...s[board], task]}));
    dispatch(newTask(task));
  }, [boards]);

  return (
    <div>
      <ProjectHead/>
        <BoardColumns
          loading={!boards || !boards['1']}
          boards={boards} onDragEnd={onDragEnd}
          createTask={createTask}
          setTask={setSelectedTask}
          setBoards={setBoards}
          setArchivedTasksVisible={setArchivedTasksVisible}
        />
      <ArchivedTasks visible={archivedTasksVisible} close={() => setArchivedTasksVisible(false)} setTask={setSelectedTask}/>
      <TaskModal visible={!!selectedTask} data={selectedTask} close={() => setSelectedTask(null)} setBoards={setBoards}/>
    </div>
  )
};

export default ProjectBoard;
