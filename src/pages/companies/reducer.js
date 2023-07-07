import produce from 'immer';
import {
  GET_COMPANIES,
  GET_COMPANIES_SUCCESS,
  ADD_COMPANY,
  ADD_COMPANY_SUCCESS,
  UPDATE_COMPANY,
  UPDATE_COMPANY_SUCCESS,
  DELETE_COMPANY,
  DELETE_COMPANY_SUCCESS,
  GET_COMPANY_SUCCESS,
  GET_COMPANY_ERROR,
  GET_COMPANY,
  UNREGISTER,
  REGISTER,
  UNREGISTER_SUCCESS,
  REGISTER_SUCCESS
} from './constants';

export const initialState = {
  companies: {loading: false, data: []},
  companyDetail: {loading: false, data: null},
};

export default function (state = initialState, action = {}) {
  return produce(state, (draft) => {
    switch (action.type) {
      case UNREGISTER:
      case REGISTER:
      case GET_COMPANIES:
          draft.companies.loading = true;
        break;
      case GET_COMPANIES_SUCCESS:
        draft.companies.data = action.payload;
        draft.companies.loading = false;
        break;
      case DELETE_COMPANY:
        draft.companies.data = state.companies.data.filter(n => n._id !== action.data);
        break;
      case ADD_COMPANY: 
        draft.companies.data = [...state.companies.data, action.data.data];
        break
      case UPDATE_COMPANY: 
        // const index = state.companies.data.findIndex(c => c._id === action.data.data.id);
        // draft.companies.data[index] = action.data.data;
        break
      case GET_COMPANY:
        draft.companyDetail.loading = true;
        break;
      case GET_COMPANY_SUCCESS:
        draft.companyDetail.data = action.payload;
        draft.companyDetail.loading = false;
        break;
      case GET_COMPANY_ERROR:
        draft.companyDetail.data = null;
        draft.companyDetail.loading = false;
        break;
      default:
        return state;
    }
  });
}
