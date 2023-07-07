import {takeLatest, put, call, select} from "redux-saga/effects";
import {toast} from "react-toastify";
import {axios} from "../../config";
import {
  GET_PROGRAMS,
  GET_PROGRAMS_SUCCESS,
  ADD_PROGRAM,
  ADD_PROGRAM_SUCCESS,
  UPDATE_PROGRAM,
  UPDATE_PROGRAM_SUCCESS,
  DELETE_PROGRAM,
  DELETE_PROGRAM_SUCCESS,
  GET_PROGRAM,
  GET_COACHS,
  GET_PROGRAM_FOR_EDIT,
  GET_PROGRAM_FOR_EDIT_SUCCESS,
  UNREGISTER,
  REGISTER,
  GET_USER_PROGRAMS,
  GET_USER_PROGRAMS_SUCCESS,

} from "./constants";
import {
  getProgramsSuccess,
  getProgramSuccess,
  getProgramForEditSuccess,
  getProgramError,
  getCoachsSuccess,
} from "./actions";


export function* addProgram(action) {
  try {
    const res = yield call(axios.post, '/program', action.data.data);
    toast.success('Le programme a bien été créée');
    action.data.navigateTo()
  } catch (e) {
    console.log(e)
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* register(action) {
  try {
    const id = yield select(s => s.auth.user.data._id);
    const body = {
      id
    }
    const res = yield call(axios.put, '/program/register/' + action.data.id, body);
    action.data.callback()
    toast.success('Votre inscription a bien été enregistrée.');
  } catch (e) {
    console.log(e)
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* unregister(action) {
  try {
    const id = yield select(s => s.auth.user.data._id);
    const body = {
      id
    }
    const res = yield call(axios.put, '/program/unregister/' + action.data.id, body);
    action.data.callback()
    toast.success('Votre désinscription a bien été enregistrée.');
  } catch (e) {
    console.log(e)
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* getCoachs(action) {
  try {
    const userId = yield select(s => s.auth.user.data._id);
    const res = yield call(axios.get, '/user/getCoachs/' + userId);
    yield put(getCoachsSuccess(res.data));
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* getProgramsList(action) {
  try {
    const userId = yield select(s => s.auth.user.data._id);
    const res = yield call(axios.get, '/program/getAll/' + userId);
    yield put(getProgramsSuccess(res.data));
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* getUserProgramsList(action) {
  try {
    const userId = yield select(s => s.auth.user.data._id);
    const res = yield call(axios.get, '/program/getUserPrograms/' + userId);
    yield put(getProgramsSuccess(res.data));
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* removeProgram(action) {
  try {
    yield call(axios.delete, `/program/${action.data}`);
    toast.success('Le programme a bien été supprimé');
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* updateProgram(action) {
  try {
    const programId = yield select(s => s.program.programDetail.data._id);
    yield call(axios.put, '/program/' + programId, action.data.finalData || action.data.data);
    action.data.navigateTo()
    toast.success('Le programme a bien été modifié');
  } catch (e) {
    console.log(e)
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* getProgram(action) {
  try {
    const res = yield call(axios.get, '/program/' + action.data);
    yield put(getProgramSuccess(res.data));
  } catch (e) {
    console.log(e, 'fcgcgggcgc')
    yield put(getProgramError(e?.response?.data));
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* getProgramForEdit(action) {
  try {
    const res = yield call(axios.get, '/program/getProgramForEdit/' + action.data);
    yield put(getProgramForEditSuccess(res.data));
  } catch (e) {
    console.log(e)
    yield put(getProgramError(e?.response?.data));
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export default function* () {
  yield takeLatest(GET_PROGRAMS, getProgramsList);
  yield takeLatest(GET_USER_PROGRAMS, getUserProgramsList);
  yield takeLatest(DELETE_PROGRAM, removeProgram);
  yield takeLatest(UPDATE_PROGRAM, updateProgram);
  yield takeLatest(GET_PROGRAM, getProgram);
  yield takeLatest(GET_PROGRAM_FOR_EDIT, getProgramForEdit);
  yield takeLatest(GET_COACHS, getCoachs);
  yield takeLatest(ADD_PROGRAM, addProgram);
  yield takeLatest(UNREGISTER, unregister);
  yield takeLatest(REGISTER, register);
}
