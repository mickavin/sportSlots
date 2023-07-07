import produce from 'immer';
import mapBoardData from "../../utils/mapBoardData";
import {ARCHIVE_PROJECT, DELETE_PROJECT, UNARCHIVE_PROJECT, UPDATE_NOTE} from "../dashboard/constants";
import {
  ADD_MEMBER_SUCCESS,
  GET_PROJECT_SUCCESS,
  GET_PROJECT_TASKS_SUCCESS,
  REMOVE_MEMBER,
  UPDATE_PROJECT_CALENDAR_SUCCESS,
  CREATE_NOTE,
  CREATE_NOTE_SUCCESS,
  CREATE_TODO,
  CREATE_TODO_SUCCESS,
  DELETE_NOTE,
  DELETE_TODO,
  GET_NOTES,
  GET_NOTES_SUCCESS,
  GET_TODO,
  GET_TODO_SUCCESS,
  UPDATE_TODO,
  GET_PROJECT,
  ARCHIVE_TASK,
  DELETE_TASK,
  UNARCHIVE_TASK,
  UPDATE_TASK,
  DUPLICATE_BOARD,
  UPDATE_PROJECT_LOGO_SUCCESS,
  UPDATE_PROJECT,
  MUTE_PROJECT_SUCCESS,
  LEAVE_PROJECT,
  NEW_TASK_SUCCESS,
  GET_TASK_SUCCESS,
  SET_TASK_DETAIL,
  GET_TASK,
  GET_TASK_ERROR,
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
  CREATE_COMMENT_SUCCESS,
  CREATE_COMMENT_ATTACHMENT_SUCCESS,
  CREATE_TODO_GROUP_SUCCESS,
  CREATE_TASK_TODO_SUCCESS,
  UPDATE_TODO_GROUP,
  CREATE_TASK_ATTACHMENT_SUCCESS,
  UPDATE_TASK_TODO,
  UPDATE_BOARDS
} from './constants';

export const initialState = {
  project: {loading: false, data: {}},
  tasks: {loading: false, data: []},
  todo: {loading: false, data: [], creating: false},
  notes: {loading: false, data: [], creating: false},
  taskDetail: {loading: false, data: null},
  taskList: [],
  newTaskItem: null
};

export default function (state = initialState, action = {}) {
  return produce(state, (draft) => {
    switch (action.type) {
      case GET_PROJECT:
        draft.project.loading = true;
        break;
      case GET_PROJECT_SUCCESS:
        draft.project.data = action.payload;
        draft.project.loading = false;
        break;
      case GET_PROJECT_TASKS_SUCCESS:
        draft.tasks.data = mapBoardData(action.payload.filter(t => !t.archived));
        draft.taskList = action.payload;
        draft.tasks.loading = false;
        break;
      case UPDATE_PROJECT_LOGO_SUCCESS:
        draft.project.data.image = action.payload.path;
        break;
      case UPDATE_PROJECT_CALENDAR_SUCCESS:
        draft.project.data.calendar = action.payload;
        break;
      case REMOVE_MEMBER:
        draft.project.data.members = state.project.data.members.filter(m => m._id !== action.data);
        break;
      case ADD_MEMBER_SUCCESS:
        draft.project.data.members.push(action.payload);
        break;
      case ARCHIVE_TASK:
        draft.taskList = state.taskList.map(t => action.data.includes(t._id) ? {...t, archived: true} : t);
        if (state.taskDetail.data) draft.taskDetail.data.archived = true;
        break;
      case UNARCHIVE_TASK:
        const newData = state.taskList.map(t => action.data.includes(t._id) ? {...t, board: parseInt(t.board), archived: false} : t);
        draft.taskList = newData;
        draft.tasks.data = mapBoardData(newData.filter(t => !t.archived));
        if (state.taskDetail.data) draft.taskDetail.data.archived = false;
        break;
      case DUPLICATE_BOARD:
        draft.taskList.push(action.data);
        break;
      case UPDATE_BOARDS:
        draft.taskList = state.taskList.map(t => action.data.data.map(d=>d._id).includes(t._id) ? {...t, ...action.data.data.find(d => d._id === t._id)} : t);
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
      case ARCHIVE_PROJECT:
        if (state.project.data._id === action.data) draft.project.data.archived = true;
        break;
      case UNARCHIVE_PROJECT:
        if (state.project.data._id === action.data) draft.project.data.archived = false;
        break;
      case UPDATE_PROJECT:
        draft.project.data = {...state.project.data, ...action.data};
        break;
      case MUTE_PROJECT_SUCCESS:
        draft.project.data.mutedBy = action.payload.mutedBy;
        break;
      case DELETE_PROJECT:
      case LEAVE_PROJECT:
        if (state.project.data._id === action.data) draft.project.data = {};
        break;
      /* TASKS */
      case GET_TASK:
        draft.taskDetail.loading = true;
        break;
      case GET_TASK_SUCCESS:
        draft.taskDetail.data = action.payload;
        draft.taskDetail.loading = false;
        break;
      case GET_TASK_ERROR:
        draft.taskDetail.data = null;
        draft.taskDetail.loading = false;
        break;
      case SET_TASK_DETAIL:
        draft.taskDetail.data = action.data ? {...state.taskDetail.data, ...action.data} : null;
        break;
      case DELETE_TASK:
        draft.taskList = state.taskList.filter(t => !action.data.includes(t._id));
        draft.taskDetail.data = null;
        break;
      case UPDATE_TASK:
        draft.taskList = state.taskList.map(t => t._id === action.data._id ? {...t, ...action.data.data} : t);
        draft.taskDetail.data = {...state.taskDetail.data, ...action.data.data};
        break;
      case NEW_TASK_SUCCESS:
        draft.taskList.push(action.payload);
        draft.newTaskItem = action.payload;
        break;

      case CREATE_COMMENT:
        draft.taskDetail.data.comments = [...(state.taskDetail.data.comments||[]), action.data.data];
        break;
      case CREATE_COMMENT_SUCCESS:
        const commentIndex = state.taskDetail.data.comments.findIndex(c => c._id === action.payload.tmpId);
        draft.taskDetail.data.comments[commentIndex]._id = action.payload._id;
        break;
      case UPDATE_COMMENT:
        const index = state.taskDetail.data.comments.findIndex(c => c._id === action.data.id);
        draft.taskDetail.data.comments[index].content = action.data.data.content;
        break;
      case CREATE_COMMENT_ATTACHMENT:
        draft.taskDetail.data.comments[state.taskDetail.data.comments.findIndex(c => c._id === action.data.id)]
          .attachments = action.data.tmp;
        break;
      case CREATE_COMMENT_ATTACHMENT_SUCCESS:
        draft.taskDetail.data.comments[state.taskDetail.data.comments.findIndex(c => c._id === action.payload.comment)]
          .attachments = action.payload.uploadedAttachments;
        break;
      case DELETE_COMMENT_ATTACHMENT:
        const i = state.taskDetail.data.comments.findIndex(c => c._id === action.data.comment);
        draft.taskDetail.data.comments[i].attachments = state.taskDetail.data.comments[i].attachments.filter(a => a._id !== action.data.attachmentId);
        break;
      case DELETE_COMMENT:
        draft.taskDetail.data.comments = state.taskDetail.data.comments.filter(c => c._id !== action.data);
        break;
      case CREATE_TODO_GROUP:
        draft.taskDetail.data.todoGroup = [...(state.taskDetail.data.todoGroup||[]), action.data];
        break;
      case CREATE_TODO_GROUP_SUCCESS:
        const todoGroupIndex = state.taskDetail.data.todoGroup.findIndex(c => c._id === action.payload.tmpId);
        draft.taskDetail.data.todoGroup[todoGroupIndex]._id = action.payload._id;
        break;
      case UPDATE_TODO_GROUP:
        draft.taskDetail.data.todoGroup[state.taskDetail.data.todoGroup.findIndex(c => c._id === action.data.id)].title = action.data.title;
        break;
      case CREATE_TASK_TODO:
        const groupIndex = state.taskDetail.data.todoGroup.findIndex(c => c._id === action.data.todoGroupId);
        draft.taskDetail.data.todoGroup[groupIndex].list.push(action.data);
        break;
      case CREATE_TASK_TODO_SUCCESS:
        const gIndex = state.taskDetail.data.todoGroup.findIndex(c => c._id === action.payload.todoGroupId);
        const todoIndex = state.taskDetail.data.todoGroup[gIndex].list.findIndex(l => l._id === action.payload.tmpId);
        draft.taskDetail.data.todoGroup[gIndex].list[todoIndex]._id = action.payload._id;
        break;
      case UPDATE_TASK_TODO:
        const groupId = state.taskDetail.data.todoGroup.findIndex(c => c._id === action.data.todoGroupId);
        const tIndex = state.taskDetail.data.todoGroup[groupId].list.findIndex(l => l._id === action.data.todoId);
        const item = {...state.taskDetail.data.todoGroup[groupId].list[tIndex]};
        draft.taskDetail.data.todoGroup[groupId].list[tIndex] = {...item, ...action.data.data};
        break;
      case DELETE_TASK_TODO:
        const tGroupIndex = state.taskDetail.data.todoGroup.findIndex(c => c._id === action.data.groupId);
        draft.taskDetail.data.todoGroup[tGroupIndex].list = state.taskDetail.data.todoGroup[tGroupIndex].list.filter(t => t._id !== action.data.todoId);
        break;
      case DELETE_TODO_GROUP:
        draft.taskDetail.data.todoGroup = state.taskDetail.data.todoGroup.filter(t => t._id !== action.data);
        break;
      case CREATE_TASK_ATTACHMENT:
        draft.taskDetail.data.attachments = [...(state.taskDetail.data.attachments||[]), ...action.data.data];
        break;
      case CREATE_TASK_ATTACHMENT_SUCCESS:
        draft.taskDetail.data.attachments = state.taskDetail.data.attachments.map(a => {
            const item = action.payload.find(b => b.tmpId === a._id);
            if (item) return item; else return a;
          });
        break;
      case DELETE_TASK_ATTACHMENT:
        draft.taskDetail.data.attachments = state.taskDetail.data.attachments.filter(a => a._id !== action.data.attachment);
        break;

      default:
        return state;
    }
  });
}
