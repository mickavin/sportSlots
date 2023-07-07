import {takeLatest, put, call, select} from "redux-saga/effects";
import {toast} from "react-toastify";
import {axios} from "../../config";
import {
  GET_SPORTS,
  GET_SPORTS_SUCCESS,
  ADD_SPORT,
  ADD_SPORT_SUCCESS,
  UPDATE_SPORT,
  UPDATE_SPORT_SUCCESS,
  DELETE_SPORT,
  DELETE_SPORT_SUCCESS,
  GET_SPORT,
  GET_SPORTS_FOR_FILTER
} from "./constants";
import {
  getSportsSuccess,
  getSportSuccess,
  getSportError,
  deleteSport,
  deleteSportSuccess,
  editSport,
  editSportSuccess,
  addSport,
  addSportSuccess,
  getSports
} from "./actions";

export function* getSportsList(action) {
  try {
    const res = yield call(axios.get, '/sport');
    yield put(getSportsSuccess(res.data));
  } catch (e) {
    // action.data.navigate('/dashboard/projects');
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* getSportsForFilterList(action) {
  try {
    const userId = yield select(s => s.auth.user.data._id);
    const res = yield call(axios.get, '/sport/getAllForFilter/' + userId);
    yield put(getSportsSuccess(res.data));
    console.log(res.data)
  } catch (e) {
    // action.data.navigate('/dashboard/projects');
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* removeSport(action) {
  try {
    yield call(axios.delete, `/sport/${action.data}`);
    toast.success('Le sport a bien été supprimé');
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* addSportToBase(action) {
  try {
    yield call(axios.post, '/sport', action.data.data);
    toast.success('Le sport a bien été créé');
    action.data.navigateTo()
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* updateSport(action) {
  try {
    const sportId = yield select(s => s.sport.sportDetail.data._id);
    yield call(axios.put, '/sport/' + sportId, action.data.data);
    toast.success('Le sport a bien été modifié');
    action.data.navigateTo()
  } catch (e) {
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export function* getSport(action) {
  try {
    const res = yield call(axios.get, '/sport/' + action.data);
    yield put(getSportSuccess(res.data));
  } catch (e) {
    yield put(getSportError(e?.response?.data));
    toast.warn(e?.response?.data?.message || 'Une erreur est survenue');
  }
}

export default function* () {
  yield takeLatest(GET_SPORTS_FOR_FILTER, getSportsForFilterList);
  yield takeLatest(GET_SPORTS, getSportsList);
  yield takeLatest(DELETE_SPORT, removeSport);
  yield takeLatest(UPDATE_SPORT, updateSport);
  yield takeLatest(GET_SPORT, getSport);
  yield takeLatest(ADD_SPORT, addSportToBase);
}
