import {
  ARCHIVE_PROJECT,
  CREATE_NOTE,
  CREATE_NOTE_SUCCESS,
  CREATE_NOTIFICATION,
  CREATE_PROJECT,
  CREATE_PROJECT_SUCCESS,
  CREATE_TODO,
  CREATE_TODO_SUCCESS,
  DELETE_NOTE, DELETE_PROJECT,
  DELETE_TODO,
  GET_INVITATIONS,
  GET_INVITATIONS_SUCCESS,
  GET_NOTES,
  GET_NOTES_SUCCESS,
  GET_PROJECTS,
  GET_PROJECTS_SUCCESS,
  GET_TODO,
  GET_TODO_SUCCESS,
  SET_NOTIFICATIONS_SEEN,
  UNARCHIVE_PROJECT,
  UPDATE_INVITATION, UPDATE_NOTE,
  UPDATE_TODO
} from "./constants";

export const getProjects = () => ({type: GET_PROJECTS});
export const getProjectsSuccess = payload => ({type: GET_PROJECTS_SUCCESS, payload});

export const getInvitations = () => ({type: GET_INVITATIONS});
export const getInvitationsSuccess = payload => ({type: GET_INVITATIONS_SUCCESS, payload});
export const updateInvitation = data => ({type: UPDATE_INVITATION, data});

export const getTodo = data => ({type: GET_TODO, data});
export const getTodoSuccess = payload => ({type: GET_TODO_SUCCESS, payload});
export const updateTodo = data => ({type: UPDATE_TODO, data});
export const createTodo = data => ({type: CREATE_TODO, data});
export const createTodoSuccess = data => ({type: CREATE_TODO_SUCCESS, data});
export const deleteTodo = data => ({type: DELETE_TODO, data});

export const getNotes = data => ({type: GET_NOTES, data});
export const getNotesSuccess = payload => ({type: GET_NOTES_SUCCESS, payload});
export const updateNote = data => ({type: UPDATE_NOTE, data});
export const createNote = data => ({type: CREATE_NOTE, data});
export const createNoteSuccess = data => ({type: CREATE_NOTE_SUCCESS, data});
export const deleteNote = data => ({type: DELETE_NOTE, data});

export const createProject = data => ({type: CREATE_PROJECT, data});
export const createProjectSuccess = payload => ({type: CREATE_PROJECT_SUCCESS, payload});

export const archiveProject = data => ({type: ARCHIVE_PROJECT, data});
export const unarchiveProject = data => ({type: UNARCHIVE_PROJECT, data});
export const deleteProject = data => ({type: DELETE_PROJECT, data});

export const setNotificationsSeen = data => ({type: SET_NOTIFICATIONS_SEEN, data});

export const createNotification = data => ({type: CREATE_NOTIFICATION, data});
