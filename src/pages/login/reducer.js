import produce from 'immer';
import {
  GET_USERS,
  GET_USERS_SUCCESS,
  GET_USER,
  GET_USER_SUCCESS,
  LOGIN,
  LOGIN_ERROR,
  LOGIN_SUCCESS, 
  LOGOUT, 
  REGISTER, 
  REGISTER_SUCCESS, 
  SET_MODE, 
  UPDATE_USER, 
  UPDATE_USER_AVATAR,
  UPDATE_USER_SUCCESS,
  UPLOAD_IMAGE,
  UPDATE_ROLE,
  UNREGISTER_COMPANY_SUCCESS,
  REGISTER_COMPANY_SUCCESS,
  UNREGISTER_COMPANY,
  REGISTER_COMPANY
} from './constants';
import {SET_NOTIFICATIONS_SEEN} from "../dashboard/constants";

export const initialState = {
  isLogin: typeof window != 'undefined' ? localStorage.getItem("token") : false,
  mode: typeof window != 'undefined' && localStorage?.getItem('mode') ? localStorage.getItem('mode') : 'dark',
  user: {
    data: {},
    loading: false
  },
  users: {
    data: [],
    loading: false
  }
};

export default function (state = initialState, action = {}) {
  return produce(state, (draft) => {
    switch (action.type) {
      case LOGIN:
      case REGISTER:
      case UNREGISTER_COMPANY:
      case REGISTER_COMPANY:
      case REGISTER_COMPANY_SUCCESS:
        draft.user.data = {...state.user.data, ...action.payload};
      case UNREGISTER_COMPANY_SUCCESS:
        if(draft.user.data?.company){
          draft.user.data.company = null
        }
      case GET_USER:
      case GET_USERS_SUCCESS:
        draft.users.data = action.data
        draft.users.loading = false;
      case GET_USERS:
        draft.users.loading = true;
      case UPLOAD_IMAGE:
      case UPDATE_ROLE:
      case UPDATE_USER:
            draft.user.loading = true;
        break;
      case LOGIN_SUCCESS:
        draft.user.data = {...state.user.data, ...action.payload};
        draft.isLogin = true;
        draft.user.loading = false;
      case REGISTER_SUCCESS:
        draft.user.data = {...state.user.data, ...action.payload};
        draft.isLogin = true;
        draft.user.loading = false;
        break;
      case LOGIN_ERROR:
        draft.user.loading = false;
        break;
      case GET_USER_SUCCESS:
        draft.user.loading = false;
      case UPDATE_USER_SUCCESS:
        draft.user.data = {...state.user.data, ...action.payload};
        draft.user.loading = false;
        break;
      case SET_MODE:
        draft.mode = action.payload;
        if(typeof window != 'undefined'){
          localStorage.setItem('mode', action.payload);
        }
        break;
      case SET_NOTIFICATIONS_SEEN:
        draft.user.data.notifications = state.user.data.notifications.map(n => action.data.ids.includes(n._id) ? {...n, seen: true} : n);
        break;
      case UPDATE_USER_AVATAR:
        draft.user.data.avatar = action.data.preview;
        break;
      case LOGOUT:
        draft.isLogin = false;
        draft.user.loading = false;
        draft.user.data = {}
        break;

      default:
        return state;
    }
  });
}
