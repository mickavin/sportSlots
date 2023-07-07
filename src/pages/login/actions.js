import {
  GET_USERS,
  GET_USER,
  GET_USER_SUCCESS,
  GET_USERS_SUCCESS,
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
  REGISTER_COMPANY,
} from './constants';

export const login = data => ({type: LOGIN, data});
export const loginSuccess = payload => ({type: LOGIN_SUCCESS, payload});
export const loginError = error => ({type: LOGIN_ERROR, error});

export const register = data => ({type: REGISTER, data});
export const registerSuccess = payload => ({type: REGISTER_SUCCESS, payload});

export const unregisterCompanySuccess = payload => ({type: UNREGISTER_COMPANY_SUCCESS, payload});
export const registerCompanySuccess = payload => ({type: REGISTER_COMPANY_SUCCESS, payload});
export const unregisterCompany = data => ({type: UNREGISTER_COMPANY, data});
export const registerCompany = data => ({type: REGISTER_COMPANY, data});

export const updateUser = data => ({type: UPDATE_USER, data});
export const updateUserSuccess = payload => ({type: UPDATE_USER_SUCCESS, payload});

export const getUser = data => ({type: GET_USER, data});
export const getUserSuccess = payload => ({type: GET_USER_SUCCESS, payload});

export const getUsers = data => ({type: GET_USERS, data});
export const getUsersSuccess = data => ({type: GET_USERS_SUCCESS, data});

export const updateUserAvatar = data => ({type: UPDATE_USER_AVATAR, data});
export const uploadImage = data => ({type: UPLOAD_IMAGE, data});
export const updateRole = data => ({type: UPDATE_ROLE, data});

export const setMode = payload => ({type: SET_MODE, payload});
export const logout = () => ({type: LOGOUT});
