import {takeLatest, put, call, select} from "redux-saga/effects";
import {axios}  from '../../config';
import {
  getUsersSuccess,
  getUserSuccess,
  loginError,
  loginSuccess,
  registerSuccess,
  updateUserSuccess,
  registerCompanySuccess,
  unregisterCompanySuccess
} from './actions';
import {
  GET_USER,
  GET_USERS,
  LOGIN,
  REGISTER,
  UPDATE_USER, 
  UPDATE_ROLE, 
  UPDATE_USER_AVATAR, 
  UPLOAD_IMAGE,
  REGISTER_COMPANY,
  UNREGISTER_COMPANY
} from './constants';
import {toast} from "react-toastify";
import {delay} from "../../utils/helpers";
import {SET_NOTIFICATIONS_SEEN} from "../dashboard/constants";
import {fixImgPath} from '../../utils/helpers'

export function* loginRequest(action) {
  try {
    const {email, password} = action.data;
    const res = yield call(axios.post, '/user/login', {email, password});
    const {token} = res.data;
    if(typeof window != 'undefined'){
      localStorage.setItem("token", token);
    }
    yield call(axios.setToken, token);
    yield put(loginSuccess(res.data));
    action.data.navigate('/join-program');
  } catch (e) {
    console.log(e, 'drfgbhj')
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
    yield put(loginError(e));
  }
}

export function* registerRequest(action) {
  try {
    const {firstName, lastName, email, password, civility} = action.data;
    const res = yield call(axios.post, '/user', {firstName, lastName, email, password, civility});
    const {token} = res.data;
    if(typeof window != 'undefined'){
      localStorage.setItem("token", token);
    }
    yield call(axios.setToken, token);
    yield put(registerSuccess(res.data));
    action.data.navigate('/join-program');
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
    yield put(loginError(e));
  }
}

export function* getUser() {
  try {
    const res = yield call(axios.get, '/user');
    yield put(getUserSuccess(res.data));
  } catch (e) {
    if(typeof window != 'undefined'){
      localStorage.removeItem('token');
    }
    toast.warn(e?.response?.data?.message || 'Connectez-vous pour accéder à cette page.');
  }
}

export function* getUsers() {
  try {
    const userId = yield select(s => s.auth.user.data._id);
    const res = yield call(axios.get, '/user/getAll/' + userId);
    yield put(getUsersSuccess(res.data));
  } catch (e) {
    console.log(e)
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue.');
  }
}

export function* updateUser(action) {
  try {
    const res = yield call(axios.put, '/user', action.data);
    yield put(updateUserSuccess(res.data));
    toast.success('Le profil a bien été modifié ');
  } catch (e) {}
}

export function* updateRole(action) {
  try {
    const res = yield call(axios.put, '/user/updateRole', action.data);
    const userId = yield select(s => s.auth.user.data._id);
    const res2 = yield call(axios.get, '/user/getAll/' + userId);
    yield put(getUsersSuccess(res2.data));
  } catch (e) {}
}

export function* setNotificationsSeen(action) {
  try {
    yield call(axios.put, '/notification/setSeen', action.data);
  } catch (e) {}
}

export function* updateAvatar(action) {
  yield call(axios.put, '/user/avatar', action.data.formData, {headers: {"Content-Type": "multipart/form-data"}});
}

export function* uploadImage(action) {
  try {
    const res = yield call(axios.put, '/sport/image', action.data.formData, {headers: {"Content-Type": "multipart/form-data"}});

    action.data.setter(fixImgPath(res.data.path))
  } catch (e) {
    console.log(e)
  }
}

export function* register(action) {
  try {
    const token = typeof window != 'undefined' ? localStorage.getItem('token') : null;
    axios.setToken(token);
    const userId = yield select(s => s.auth.user.data._id);
    const body = {
      id: userId,
      code: action.data.code
    }
    const res = yield call(axios.put, '/company/register', body);
    yield put(loginSuccess(res.data));
    toast.success('Vous avez bien été ajouté au programme COPRATIK de votre entreprise');
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* unregister(action) {
  try {
    const user = yield select(s => s.auth.user.data);
    const body = {
      id: user._id,
      companyId: user.company
    }
    const res = yield call(axios.put, '/company/unregister', body);
    yield put(unregisterCompanySuccess(res.data));
    toast.success('Vous avez bien été retiré du programme COPRATIK de votre entreprise');
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export default function* () {
  yield takeLatest(LOGIN, loginRequest);
  yield takeLatest(REGISTER, registerRequest);
  yield takeLatest(GET_USER, getUser);
  yield takeLatest(GET_USERS, getUsers);
  yield takeLatest(UPDATE_USER, updateUser);
  yield takeLatest(UPDATE_ROLE, updateRole);
  yield takeLatest(SET_NOTIFICATIONS_SEEN, setNotificationsSeen);
  yield takeLatest(UPDATE_USER_AVATAR, updateAvatar);
  yield takeLatest(UPLOAD_IMAGE, uploadImage);
  yield takeLatest(UNREGISTER_COMPANY, unregister);
  yield takeLatest(REGISTER_COMPANY, register);
}
