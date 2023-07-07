import {combineReducers} from 'redux';

import authReducer from '../pages/login/reducer';
import projectReducer from '../pages/Project/reducer';
import dashboardReducer from '../pages/dashboard/reducer';
import sportReducer from '../pages/sports/reducer';
import programReducer from '../pages/programs/reducer';
import companyReducer from '../pages/companies/reducer';
import chatReducer from '../components/Chat/reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  project: projectReducer,
  dashboard: dashboardReducer,
  chat: chatReducer,
  sport: sportReducer,
  program: programReducer,
  company: companyReducer
});

export default rootReducer;
