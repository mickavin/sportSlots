import {takeLatest, put, call} from "redux-saga/effects";
import {
  createNoteSuccess, createProjectSuccess,
  createTodoSuccess,
  getInvitationsSuccess,
  getNotesSuccess,
  getProjectsSuccess,
  getTodoSuccess
} from "./actions";
import {
  CREATE_NOTE, CREATE_NOTIFICATION, CREATE_PROJECT, CREATE_TODO, DELETE_NOTE, DELETE_TODO,
  GET_INVITATIONS,
  GET_NOTES,
  GET_PROJECTS,
  GET_TODO,
  UPDATE_NOTE, UPDATE_TODO,
} from "./constants";
import {toast} from "react-toastify";
import {axios} from "../../config";
import {updateProjectLogoSuccess} from "../Project/actions";

export function* getTodo() {
  const res = yield call(axios.get, '/todo/user');
  yield put(getTodoSuccess(res.data))
}

export function* createTodo(action) {
  const res = yield call(axios.post, '/todo', action.data);
  yield put(createTodoSuccess({data: res.data, _id: action.data._id}))
}

export function* updateTodo(action) {
  yield call(axios.put, '/todo/' + action.data._id, action.data);
}

export function* deleteTodo(action) {
  yield call(axios.delete, '/todo/' + action.data);
}

export function* getNotes() {
  const res = yield call(axios.get, '/note/user');
  yield put(getNotesSuccess(res.data))
}

export function* createNote(action) {
  const res = yield call(axios.post, '/note', action.data);
  yield put(createNoteSuccess({data: res.data, _id: action.data._id}))
}

export function* updateNote(action) {
  try {
    yield call(axios.put, '/note/' + action.data._id, action.data);
  } catch (e) {}
}

export function* deleteNote(action) {
  try {
    yield call(axios.delete, '/note/' + action.data);
  } catch (e) {}
}

export function* getProjects() {
  try {
    const res = yield call(axios.get, '/project');
    yield put(getProjectsSuccess(res.data))
  } catch (e) {}
}

export function* createProject(action) {
  try {
    const res = yield call(axios.post, '/project', {name: action.data.name, members: action.data.members});
    yield put(createProjectSuccess({...res.data, image: action.data.logo ? URL.createObjectURL(action.data.logo) : ''}));
    action.data.navigate('/project/' + res.data._id);
    if (action.data.logo) {
      const formData = new FormData();
      formData.append('logo', action.data.logo);
      const logoRes = yield call(axios.put, `/project/${res.data._id}/logo`, formData, {headers: {"Content-Type": "multipart/form-data"}});
      yield put(updateProjectLogoSuccess({_id: res.data._id, path: logoRes.data.path}));
    }
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* getInvitations() {
  try {
    const res = yield call(axios.get, '/user/invitations');
    yield put(getInvitationsSuccess(res.data));
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* createNotification(action) {
  try {
    yield call(axios.post, '/notification', action.data);
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export default function* () {
  yield takeLatest(GET_TODO, getTodo);
  yield takeLatest(CREATE_TODO, createTodo);
  yield takeLatest(UPDATE_TODO, updateTodo);
  yield takeLatest(DELETE_TODO, deleteTodo);
  yield takeLatest(GET_NOTES, getNotes);
  yield takeLatest(CREATE_NOTE, createNote);
  yield takeLatest(UPDATE_NOTE, updateNote);
  yield takeLatest(DELETE_NOTE, deleteNote);
  yield takeLatest(GET_INVITATIONS, getInvitations);
  yield takeLatest(GET_PROJECTS, getProjects);
  yield takeLatest(CREATE_PROJECT, createProject);
  yield takeLatest(CREATE_NOTIFICATION, createNotification);
}
