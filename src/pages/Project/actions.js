import {
  GET_PROJECT,
  GET_PROJECT_SUCCESS,
  GET_PROJECT_TASKS,
  GET_PROJECT_TASKS_SUCCESS,
  NEW_TASK,
  NEW_TASK_SUCCESS,
  UPDATE_BOARDS,
  UPDATE_PROJECT_CALENDAR,
  UPDATE_PROJECT_CALENDAR_SUCCESS,
  UPDATE_TASK,
  CREATE_NOTE,
  CREATE_TODO,
  DELETE_NOTE,
  DELETE_TODO,
  GET_NOTES,
  GET_NOTES_SUCCESS,
  GET_TODO,
  GET_TODO_SUCCESS,
  UPDATE_NOTES,
  UPDATE_TODO,
  GET_PROJECT_HISTORY,
  ADD_MEMBER,
  ADD_MEMBER_SUCCESS,
  REMOVE_MEMBER,
  GET_TASK,
  GET_TASK_SUCCESS,
  ARCHIVE_TASK,
  UNARCHIVE_TASK,
  DELETE_TASK,
  GET_ARCHIVED_TASKS,
  GET_ARCHIVED_TASKS_SUCCESS,
  DUPLICATE_BOARD,
  UPDATE_PROJECT_LOGO,
  UPDATE_PROJECT_LOGO_SUCCESS,
  UPDATE_PROJECT,
  MUTE_PROJECT,
  MUTE_PROJECT_SUCCESS,
  ACCEPT_INVITATION,
  DECLINE_INVITATION,
  LEAVE_PROJECT,
  SET_TASK_ITEM,
  SET_TASK_DETAIL,
  GET_TASK_ERROR,
  CREATE_TODO_GROUP,
  CREATE_TODO_GROUP_SUCCESS,
  CREATE_TASK_TODO,
  CREATE_TASK_TODO_SUCCESS,
  CREATE_TASK_ATTACHMENT_SUCCESS,
  CREATE_TASK_ATTACHMENT,
  DELETE_TODO_GROUP,
  DELETE_TASK_TODO,
  DELETE_TASK_ATTACHMENT,
  CREATE_COMMENT,
  CREATE_COMMENT_SUCCESS,
  CREATE_COMMENT_ATTACHMENT,
  CREATE_COMMENT_ATTACHMENT_SUCCESS,
  DELETE_COMMENT,
  DELETE_COMMENT_ATTACHMENT,
  UPDATE_COMMENT,
  UPDATE_TODO_GROUP, UPDATE_TASK_TODO
} from "./constants";

export const getProject = data => ({type: GET_PROJECT, data});
export const getProjectSuccess = payload => ({type: GET_PROJECT_SUCCESS, payload});

export const getProjectTasks = data => ({type: GET_PROJECT_TASKS, data});
export const getProjectTasksSuccess = payload => ({type: GET_PROJECT_TASKS_SUCCESS, payload});

export const getArchivedTasks = data => ({type: GET_ARCHIVED_TASKS, data});
export const getArchivedTasksSuccess = payload => ({type: GET_ARCHIVED_TASKS_SUCCESS, payload});

export const updateProjectCalendar = data => ({type: UPDATE_PROJECT_CALENDAR, data});
export const updateProjectCalendarSuccess = payload => ({type: UPDATE_PROJECT_CALENDAR_SUCCESS, payload});

export const updateTask = data => ({type: UPDATE_TASK, data});

export const newTask = data => ({type: NEW_TASK, data});
export const newTaskSuccess = payload => ({type: NEW_TASK_SUCCESS, payload});

export const getProjectHistory = data => ({type: GET_PROJECT_HISTORY, data});

export const addMember = data => ({type: ADD_MEMBER, data});
export const addMemberSuccess = payload => ({type: ADD_MEMBER_SUCCESS, payload});

export const removeMember = data => ({type: REMOVE_MEMBER, data});

export const acceptInvitation = data => ({type: ACCEPT_INVITATION, data});
export const declineInvitation = data => ({type: DECLINE_INVITATION, data});

export const getTodo = data => ({type: GET_TODO, data});
export const getTodoSuccess = payload => ({type: GET_TODO_SUCCESS, payload});
export const updateTodo = data => ({type: UPDATE_TODO, data});
export const createTodo = data => ({type: CREATE_TODO, data});
export const deleteTodo = data => ({type: DELETE_TODO, data});

export const getNotes = data => ({type: GET_NOTES, data});
export const getNotesSuccess = payload => ({type: GET_NOTES_SUCCESS, payload});
export const updateNote = data => ({type: UPDATE_NOTES, data});
export const createNote = data => ({type: CREATE_NOTE, data});
export const deleteNote = data => ({type: DELETE_NOTE, data});

export const updateProjectLogo = data => ({type: UPDATE_PROJECT_LOGO, data});
export const updateProjectLogoSuccess = payload => ({type: UPDATE_PROJECT_LOGO_SUCCESS, payload});

export const updateProject = data => ({type: UPDATE_PROJECT, data});

export const leaveProject = data => ({type: LEAVE_PROJECT, data});

export const muteProject = data => ({type: MUTE_PROJECT, data});
export const muteProjectSuccess = payload => ({type: MUTE_PROJECT_SUCCESS, payload});

export const duplicateBoard = data => ({type: DUPLICATE_BOARD, data});

export const archiveTask = data => ({type: ARCHIVE_TASK, data});
export const unarchiveTask = data => ({type: UNARCHIVE_TASK, data});
export const deleteTask = data => ({type: DELETE_TASK, data});

export const setTaskItem = data => ({type: SET_TASK_ITEM, data});
export const setTaskDetail = data => ({type: SET_TASK_DETAIL, data});

export const updateBoards = data => ({type: UPDATE_BOARDS, data});

export const getTask = data => ({type: GET_TASK, data});
export const getTaskSuccess = payload => ({type: GET_TASK_SUCCESS, payload});
export const getTaskError = err => ({type: GET_TASK_ERROR, err});

export const createTodoGroup = data => ({type: CREATE_TODO_GROUP, data});
export const createTodoGroupSuccess = payload => ({type: CREATE_TODO_GROUP_SUCCESS, payload});
export const updateTodoGroup = data => ({type: UPDATE_TODO_GROUP, data});

export const createTaskTodo = data => ({type: CREATE_TASK_TODO, data});
export const createTaskTodoSuccess = payload => ({type: CREATE_TASK_TODO_SUCCESS, payload});
export const updateTaskTodo = data => ({type: UPDATE_TASK_TODO, data});

export const createTaskAttachment = data => ({type: CREATE_TASK_ATTACHMENT, data});
export const createTaskAttachmentSuccess = payload => ({type: CREATE_TASK_ATTACHMENT_SUCCESS, payload});

export const deleteTodoGroup = data => ({type: DELETE_TODO_GROUP, data});

export const deleteTaskTodo = data => ({type: DELETE_TASK_TODO, data});
export const deleteTaskAttachment = data => ({type: DELETE_TASK_ATTACHMENT, data});

export const createComment = data => ({type: CREATE_COMMENT, data});
export const createCommentSuccess = payload => ({type: CREATE_COMMENT_SUCCESS, payload});

export const createCommentAttachment = data => ({type: CREATE_COMMENT_ATTACHMENT, data});
export const createCommentAttachmentSuccess = payload => ({type: CREATE_COMMENT_ATTACHMENT_SUCCESS, payload});

export const updateComment = data => ({type: UPDATE_COMMENT, data});
export const deleteCommentAttachment = data => ({type: DELETE_COMMENT_ATTACHMENT, data});
export const deleteComment = data => ({type: DELETE_COMMENT, data});
