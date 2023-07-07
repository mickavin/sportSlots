import produce from 'immer';
import {
  GET_PROJECTS_SUCCESS,
  GET_PROJECTS,
  GET_TODO,
  GET_TODO_SUCCESS,
  GET_NOTES,
  GET_NOTES_SUCCESS,
  UPDATE_NOTE,
  CREATE_NOTE,
  DELETE_NOTE,
  CREATE_NOTE_SUCCESS,
  UPDATE_TODO,
  CREATE_TODO_SUCCESS,
  CREATE_TODO,
  DELETE_TODO,
  GET_INVITATIONS,
  GET_INVITATIONS_SUCCESS,
  UPDATE_INVITATION,
  ARCHIVE_PROJECT,
  UNARCHIVE_PROJECT,
  DELETE_PROJECT,
  CREATE_PROJECT_SUCCESS,
  CREATE_PROJECT
} from './constants';
import {LEAVE_PROJECT, UPDATE_PROJECT_LOGO_SUCCESS} from "../Project/constants";

export const initialState = {
  todo: {loading: false, data: [], creating: false},
  notes: {loading: false, data: [], creating: false},
  invitations: {loading: false, data: []},
  projects: {loading: false, data: [], creating: false},
};

export default function (state = initialState, action = {}) {
  return produce(state, (draft) => {
    switch (action.type) {
      case GET_PROJECTS:
        draft.projects.loading = true;
        break;
      case GET_PROJECTS_SUCCESS:
        draft.projects.data = action.payload;
        draft.projects.loading = false;
        break;
      case CREATE_PROJECT:
        draft.projects.creating = true;
        break;
      case CREATE_PROJECT_SUCCESS:
        draft.projects.creating = false;
        break;
      case GET_INVITATIONS:
        draft.invitations.loading = true;
        break;
      case GET_INVITATIONS_SUCCESS:
        draft.invitations.data = action.payload;
        draft.invitations.loading = false;
        break;
      case GET_TODO:
        draft.todo.loading = true;
        break;
      case GET_TODO_SUCCESS:
        draft.todo.data = action.payload;
        draft.todo.loading = false;
        break;
      case GET_NOTES:
        draft.notes.loading = true;
        break;
      case GET_NOTES_SUCCESS:
        draft.notes.data = action.payload;
        draft.notes.loading = false;
        break;
      case UPDATE_NOTE:
      case CREATE_NOTE_SUCCESS:
        draft.notes.data[state.notes.data.findIndex(n => n._id === action.data._id)] = action.data.data || action.data;
        draft.notes.creating = false;
        break;
      case CREATE_NOTE:
        draft.notes.creating = true;
        draft.notes.data = [...state.notes.data, action.data];
        break;
      case DELETE_NOTE:
        draft.notes.data = state.notes.data.filter(n => n._id !== action.data);
        break;
      case UPDATE_TODO:
      case CREATE_TODO_SUCCESS:
        draft.todo.data[state.todo.data.findIndex(n => n._id === action.data._id)] = action.data.data || action.data;
        draft.todo.creating = false;
        break;
      case CREATE_TODO:
        draft.todo.creating = true;
        draft.todo.data = [...state.todo.data, action.data];
        break;
      case DELETE_TODO:
        draft.todo.data = state.todo.data.filter(n => n._id !== action.data);
        break;
      case UPDATE_INVITATION:
        draft.invitations.data = state.invitations.data.filter(i => i._id !== action.data);
        break;
      case ARCHIVE_PROJECT:
        draft.projects.data = state.projects.data.map(p => p._id === action.data ? {...p, archived: true} : p);
        break;
      case UNARCHIVE_PROJECT:
        draft.projects.data = state.projects.data.map(p => p._id === action.data ? {...p, archived: false} : p);
        break;
      case UPDATE_PROJECT_LOGO_SUCCESS:
        draft.projects.data[state.projects.data.findIndex(p => p._id === action.payload._id)].image = action.payload.path;
        break;
      case DELETE_PROJECT:
      case LEAVE_PROJECT:
        draft.projects.data = state.projects.data.filter(p => p._id !== action.data);
        break;

      default:
        return state;
    }
  });
}
