import {takeLatest, put, call, select} from "redux-saga/effects";
import {toast} from "react-toastify";
import {axios} from "../../config";
import {
  ADD_MEMBER,
  GET_ARCHIVED_TASKS,
  GET_NOTES,
  GET_PROJECT,
  GET_TODO,
  MUTE_PROJECT,
  NEW_TASK,
  REMOVE_MEMBER,
  UPDATE_BOARDS,
  UPDATE_PROJECT,
  UPDATE_PROJECT_CALENDAR,
  UPDATE_PROJECT_LOGO,
  UPDATE_TASK,
  ACCEPT_INVITATION,
  DECLINE_INVITATION,
  LEAVE_PROJECT,
  GET_TASK,
  CREATE_TODO_GROUP,
  CREATE_TASK_TODO,
  CREATE_TASK_ATTACHMENT,
  DELETE_TODO_GROUP,
  DELETE_TASK_TODO,
  DELETE_TASK_ATTACHMENT,
  CREATE_COMMENT,
  CREATE_COMMENT_ATTACHMENT,
  UPDATE_COMMENT,
  DELETE_COMMENT_ATTACHMENT,
  DELETE_COMMENT,
  ARCHIVE_TASK,
  UNARCHIVE_TASK,
  DELETE_TASK, UPDATE_TODO_GROUP, UPDATE_TASK_TODO, DUPLICATE_BOARD, GET_PROJECT_TASKS,
} from "./constants";
import {
  getProjectSuccess,
  getProjectTasksSuccess,
  updateProjectCalendarSuccess,
  getNotesSuccess,
  getTodoSuccess,
  muteProjectSuccess,
  updateProjectLogoSuccess,
  newTaskSuccess,
  addMemberSuccess,
  getTaskSuccess,
  createCommentAttachment as createCommentAttachmentAction,
  getTaskError,
  createTodoGroupSuccess,
  createTaskTodoSuccess,
  createTaskAttachmentSuccess,
  createCommentSuccess,
  createCommentAttachmentSuccess
} from "./actions";
import {
  ARCHIVE_PROJECT,
  DELETE_PROJECT,
  UNARCHIVE_PROJECT
} from "../dashboard/constants";
import {updateInvitation} from "../dashboard/actions";

export function* getProject(action) {
  try {
    const res = yield call(axios.get, '/project/' + action.data.id + '/get');
    yield put(getProjectSuccess(res.data));
    yield put(getProjectTasksSuccess(res.data.tasks));
  } catch (e) {
    action.data.navigate('/dashboard/projects');
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* getProjectTasks() {
  try {
    const projectId = yield select(s => s.project.project.data._id);
    const res = yield call(axios.get, '/project/' + projectId + '/tasks');
    yield put(getProjectTasksSuccess(res.data.tasks));
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* updateBoards(action) {
  yield call(axios.put, '/task/update/multi', {tasks: action.data.data});
}

export function* addMember(action) {
  try {
    const projectId = yield select(s => s.project.project.data._id);
    const res = yield call(axios.post, `/project/${projectId}/member`, action.data);
    yield put(addMemberSuccess(res.data.addedMember));
    yield toast.success('A new member added')
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* removeMember(action) {
  try {
    const projectId = yield select(s => s.project.project.data._id);
    yield call(axios.delete, `/project/${projectId}/member/${action.data}`);
    toast.success('Member removed');
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* leaveProject(action) {
  try {
    const userId = yield select(s => s.auth.user.data._id);
    yield call(axios.delete, `/project/${action.data}/member/${userId}?leave=1`);
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* getTodo(action) {
  try {
    const res = yield call(axios.get, '/todo/project/' + action.data);
    yield put(getTodoSuccess(res.data));
  } catch (e) {}
}

export function* getNotes(action) {
  try {
    const res = yield call(axios.get, '/note/project/' + action.data);
    yield put(getNotesSuccess(res.data));
  } catch (e) {}
}

export function* updateProject(action) {
  try {
    yield call(axios.put, '/project/' + action.data._id, action.data);
    toast.success('Le projet a bien été modifié');
  } catch (e) {}
}

export function* muteProject(action) {
  try {
    const res = yield call(axios.put, '/project/' + action.data._id + '/mute', action.data);
    yield put(muteProjectSuccess(res.data));
  } catch (e) {}
}

export function* updateProjectCalendar(action) {
  try {
    yield call(axios.put, `/project/${action.data._id}/calendar`, {data: action.data.data});
    yield put(updateProjectCalendarSuccess(action.data.data));
  } catch (e) {}
}

export function* archiveProject(action) {
  try {
    yield call(axios.put, '/project/' + action.data, {archived: true});
  } catch (e) {}
}

export function* unarchiveProject(action) {
  try {
    yield call(axios.put, '/project/' + action.data, {archived: false});
  } catch (e) {}
}

export function* updateProjectLogo(action) {
  try {
    const formData = new FormData();
    formData.append('logo', action.data.file);
    const logoRes = yield call(axios.put, `/project/${action.data._id}/logo`, formData, {headers: {"Content-Type": "multipart/form-data"}});
    yield put(updateProjectLogoSuccess({_id: action.data._id, path: logoRes.data.path +'?v='+Math.floor(Math.random() * 100)}));
  } catch (e) {}
}

export function* acceptInvitation(action) {
  try {
    yield call(axios.post, '/user/invitation/accept', {invitationId: action.data});
    yield put(updateInvitation(action.data));
    toast.success('Invitation accepted');
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* declineInvitation(action) {
  try {
    yield call(axios.post, '/user/invitation/decline', {invitationId: action.data});
    yield put(updateInvitation(action.data));
    toast.success('Invitation declined');
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* deleteProject(action) {
  try {
    yield call(axios.delete, '/project/' + action.data);
  } catch (e) {}
}

export function* getArchivedTasks(action) {
}

export function* getTask(action) {
  try {
    const res = yield call(axios.get, '/task/' + action.data);
    yield put(getTaskSuccess(res.data));
  } catch (e) {
    yield put(getTaskError(e?.response?.data));
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* newTask(action) {
  const project = yield select(s => s.project.project.data._id);
  const res = yield call(axios.post, '/task', {...action.data, project});
  yield put(newTaskSuccess({...res.data, tmpId: action.data._id}));
}

export function* duplicateBoard(action) {
  const id = yield select(s => s.project.taskDetail.data._id);
  const project = yield select(s => s.project.project.data._id);
  const res = yield call(axios.post, `/task/${id}/duplicate`, {project});
  yield put(newTaskSuccess({...res.data, tmpId: action.data._id}));
}

export function* updateTask(action) {
  try {
    const taskId = yield select(s => s.project.taskDetail.data._id);
    yield call(axios.put, '/task/' + taskId, action.data.finalData || action.data.data);
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* createTodoGroup(action) {
  try {
    const taskId = yield select(s => s.project.taskDetail.data._id);
    const item = {...action.data};
    const tmpId = item['_id'];
    delete item['_id'];
    const res = yield call(axios.put, `/task/${taskId}/todoGroup`, item);
    yield put(createTodoGroupSuccess({...res.data, tmpId}));
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* updateTodoGroup(action) {
  try {
    const taskId = yield select(s => s.project.taskDetail.data._id);
    yield call(axios.put, `/task/${taskId}/todoGroup/${action.data.id}`, {title: action.data.title});
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* createTaskTodo(action) {
  try {
    const taskId = yield select(s => s.project.taskDetail.data._id);
    const item = {...action.data};
    const tmpId = item['_id'];
    delete item['_id'];
    const res = yield call(axios.put, `/task/${taskId}/newTodo/${action.data.todoGroupId}`, item);
    yield put(createTaskTodoSuccess({...res.data, tmpId, todoGroupId: action.data.todoGroupId}));
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* updateTaskTodo(action) {
  try {
    yield call(axios.put, `/todo/${action.data.todoId}`, action.data.data);
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* deleteTodoGroup(action) {
  try {
    const taskId = yield select(s => s.project.taskDetail.data._id);
    yield call(axios.delete, `/task/${taskId}/todoGroup/${action.data}`);
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* deleteTaskTodo(action) {
  try {
    const taskId = yield select(s => s.project.taskDetail.data._id);
    yield call(axios.delete, `/task/${taskId}/todo/${action.data.todoId}`);
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* createTaskAttachment(action) {
  try {
    const formData = new FormData();
    action.data.finalData.forEach(file => formData.append('file', file));
    const res = yield call(axios.put, `/task/${action.data.task}/file`, formData, {headers: {"Content-Type": "multipart/form-data"}});
    yield put(createTaskAttachmentSuccess(res.data.uploadedAttachments.map((x, i) => ({...x, tmpId: action.data.data[i]._id}))));
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* deleteTaskAttachment(action) {
  try {
    yield call(axios.delete, `/task/${action.data.task}/file/${action.data.attachment}`);
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* archiveTask(action) {
  try {
    yield call(axios.put, '/task/update/multi', {tasks: action.data.map(t => ({_id: t, archived: true}))});
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* unarchiveTask(action) {
  try {
    yield call(axios.put, '/task/update/multi', {tasks: action.data.map(t => ({_id: t, archived: false}))});
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* createComment(action) {
  try {
    const task = yield select(s => s.project.taskDetail.data._id);
    const res = yield call(axios.post, `/comment`, {content: action.data.finalData.content, task});
    yield put(createCommentSuccess({...res.data, tmpId: action.data.data._id}));
    if (!!action.data.finalData.attachments?.length)
      yield put(createCommentAttachmentAction({id: res.data._id, files: action.data.finalData.attachments, tmp: action.data.data.attachments}));
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* createCommentAttachment(action) {
  try {
    const formData = new FormData();
    action.data.files.forEach(file => formData.append('file', file));
    const res = yield call(axios.put, `/comment/${action.data.id}/file`, formData, {headers: {"Content-Type": "multipart/form-data"}});
    yield put(createCommentAttachmentSuccess(res.data));
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* updateComment(action) {
  try {
    yield call(axios.put, '/comment/' + action.data.id, action.data.data);
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* deleteCommentAttachment(action) {
  try {
    yield call(axios.delete, `/comment/${action.data.comment}/file/${action.data.attachmentId}`);
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* deleteComment(action) {
  try {
    yield call(axios.delete, `/comment/${action.data}`);
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* deleteTask(action) {
  try {
    yield call(axios.put, `/task/delete/tasks`, {tasks: action.data});
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export default function* () {
  yield takeLatest(GET_PROJECT, getProject);
  yield takeLatest(GET_PROJECT_TASKS, getProjectTasks);
  yield takeLatest(GET_ARCHIVED_TASKS, getArchivedTasks);
  yield takeLatest(UPDATE_BOARDS, updateBoards);
  yield takeLatest(UPDATE_PROJECT_CALENDAR, updateProjectCalendar);
  yield takeLatest(ADD_MEMBER, addMember);
  yield takeLatest(REMOVE_MEMBER, removeMember);
  yield takeLatest(GET_TODO, getTodo);
  yield takeLatest(GET_NOTES, getNotes);
  yield takeLatest(ARCHIVE_PROJECT, archiveProject);
  yield takeLatest(UNARCHIVE_PROJECT, unarchiveProject);
  yield takeLatest(DELETE_PROJECT, deleteProject);
  yield takeLatest(GET_NOTES, getNotes);
  yield takeLatest(UPDATE_PROJECT, updateProject);
  yield takeLatest(MUTE_PROJECT, muteProject);
  yield takeLatest(UPDATE_PROJECT_LOGO, updateProjectLogo);
  yield takeLatest(ACCEPT_INVITATION, acceptInvitation);
  yield takeLatest(DECLINE_INVITATION, declineInvitation);
  yield takeLatest(LEAVE_PROJECT, leaveProject);
  yield takeLatest(GET_TASK, getTask);
  yield takeLatest(UPDATE_TASK, updateTask);
  yield takeLatest(NEW_TASK, newTask);
  yield takeLatest(DUPLICATE_BOARD, duplicateBoard);
  yield takeLatest(CREATE_TODO_GROUP, createTodoGroup);
  yield takeLatest(UPDATE_TODO_GROUP, updateTodoGroup);
  yield takeLatest(CREATE_TASK_TODO, createTaskTodo);
  yield takeLatest(UPDATE_TASK_TODO, updateTaskTodo);
  yield takeLatest(CREATE_TASK_ATTACHMENT, createTaskAttachment);
  yield takeLatest(DELETE_TASK_ATTACHMENT, deleteTaskAttachment);
  yield takeLatest(DELETE_TODO_GROUP, deleteTodoGroup);
  yield takeLatest(DELETE_TASK_TODO, deleteTaskTodo);
  yield takeLatest(ARCHIVE_TASK, archiveTask);
  yield takeLatest(UNARCHIVE_TASK, unarchiveTask);
  yield takeLatest(CREATE_COMMENT, createComment);
  yield takeLatest(CREATE_COMMENT_ATTACHMENT, createCommentAttachment);
  yield takeLatest(UPDATE_COMMENT, updateComment);
  yield takeLatest(DELETE_COMMENT_ATTACHMENT, deleteCommentAttachment);
  yield takeLatest(DELETE_COMMENT, deleteComment);
  yield takeLatest(DELETE_TASK, deleteTask);
}
