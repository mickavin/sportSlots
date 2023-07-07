import produce from 'immer';
import {
  GET_SPORTS,
  GET_SPORTS_SUCCESS,
  ADD_SPORT,
  ADD_SPORT_SUCCESS,
  UPDATE_SPORT,
  UPDATE_SPORT_SUCCESS,
  DELETE_SPORT,
  DELETE_SPORT_SUCCESS,
  GET_SPORT_SUCCESS,
  GET_SPORT_ERROR,
  GET_SPORT,
  GET_SPORTS_FOR_FILTER
} from './constants';

export const initialState = {
  sports: {loading: false, data: []},
  sportDetail: {loading: false, data: null},
};

export default function (state = initialState, action = {}) {
  return produce(state, (draft) => {
    switch (action.type) {
      case GET_SPORTS:
        draft.sports.loading = true;
        break;
      case GET_SPORTS_FOR_FILTER:
        draft.sports.loading = true;
        break;
      case GET_SPORTS_SUCCESS:
        draft.sports.data = action.payload;
        draft.sports.loading = false;
        break;
      case DELETE_SPORT:
        draft.sports.data = state.sports.data.filter(n => n._id !== action.data);
        break;
      case ADD_SPORT: 
        draft.sports.data = [...state.sports.data, action.data.data];
        break
      case UPDATE_SPORT: 
      
        break
      case GET_SPORT:
        draft.sportDetail.loading = true;
        break;
      case GET_SPORT_SUCCESS:
        draft.sportDetail.data = action.payload;
        draft.sportDetail.loading = false;
        break;
      case GET_SPORT_ERROR:
        draft.sportDetail.data = null;
        draft.sportDetail.loading = false;
        break;
      default:
        return state;
    }
  });
}
