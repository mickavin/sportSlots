import {all} from "redux-saga/effects";
import authSaga from '../pages/login/saga';
import projectSaga from '../pages/Project/saga';
import dashboardSaga from '../pages/dashboard/saga';
import sportSaga from '../pages/sports/saga';
import programSaga from '../pages/programs/saga';
import companySaga from '../pages/companies/saga';
import chatSaga from '../components/Chat/saga';

export default function* rootSaga() {
  yield all([authSaga(), dashboardSaga(), projectSaga(), chatSaga(), sportSaga(), programSaga(), companySaga()]);
}
