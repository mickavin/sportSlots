import {takeLatest, put, call, select} from "redux-saga/effects";
import {toast} from "react-toastify";
import {axios} from "../../config";
import {
  GET_COMPANIES,
  ADD_COMPANY,
  ADD_COMPANY_SUCCESS,
  UPDATE_COMPANY,
  UPDATE_COMPANY_SUCCESS,
  DELETE_COMPANY,
  DELETE_COMPANY_SUCCESS,
  GET_COMPANY,
  REGISTER,
  UNREGISTER
} from "./constants";
import {
  getCompaniesSuccess,
  getCompanySuccess,
  getCompanyError,
} from "./actions";
import {
  registerCompanySuccess,
  unregisterCompanySuccess
} from '../login/actions'

export function* getCompaniesList(action) {
  try {
    const res = yield call(axios.get, '/company/getAll');
    yield put(getCompaniesSuccess(res.data));
  } catch (e) {
    console.log(e)
    action.data.navigate('/dashboard/projects');
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* removeCompany(action) {
  try {
    yield call(axios.delete, `/company/${action.data}`);
    toast.success('L\'entreprise a bien été supprimée');
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
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
    yield put(registerCompanySuccess(res.data));
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

export function* addCompany(action) {
  try {
    const res = yield call(axios.post, '/company', action.data.data);
    action.data.callback(res.data.code)
    toast.success('L\'entreprise a bien été créée');
    action.data.navigateTo()
  } catch (e) {
    console.log(e)
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* updateCompany(action) {
  try {
    const companyId = yield select(s => s.company?.companyDetail?.data._id);
    yield call(axios.put, '/company/' + companyId, action.data.data);
    action.data.navigateTo()
    toast.success('L\'entreprise a bien été modifiée');
  } catch (e) {
    console.log(e)
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* getCompany(action) {
  try {
    const res = yield call(axios.get, '/company/' + action.data);
    yield put(getCompanySuccess(res.data));
  } catch (e) {
    yield put(getCompanyError(e?.response?.data));
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export default function* () {
  yield takeLatest(GET_COMPANIES, getCompaniesList);
  yield takeLatest(DELETE_COMPANY, removeCompany);
  yield takeLatest(UPDATE_COMPANY, updateCompany);
  yield takeLatest(GET_COMPANY, getCompany);
  yield takeLatest(ADD_COMPANY, addCompany);
  yield takeLatest(UNREGISTER, unregister);
  yield takeLatest(REGISTER, register);
}
