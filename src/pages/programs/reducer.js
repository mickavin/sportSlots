import produce from 'immer';
import {
  GET_PROGRAMS,
  GET_PROGRAMS_SUCCESS,
  ADD_PROGRAM,
  ADD_PROGRAM_SUCCESS,
  UPDATE_PROGRAM,
  UPDATE_PROGRAM_SUCCESS,
  DELETE_PROGRAM,
  DELETE_PROGRAM_SUCCESS,
  GET_PROGRAM_SUCCESS,
  GET_PROGRAM_ERROR,
  GET_PROGRAM,
  GET_COACHS,
  GET_COACHS_SUCCESS,
  GET_PROGRAM_FOR_EDIT,
  GET_PROGRAM_FOR_EDIT_SUCCESS,
  UNREGISTER,
  REGISTER,
  GET_USER_PROGRAMS,
  GET_USER_PROGRAMS_SUCCESS
} from './constants';

export const initialState = {
  coachs: {loading: false, data: []},
  programs: {loading: false, data: []},
  programDetail: {loading: false, data: null},
};

export default function (state = initialState, action = {}) {
  return produce(state, (draft) => {
    switch (action.type) {
      case UNREGISTER:
      case REGISTER:
      case GET_COACHS:
      case GET_COACHS_SUCCESS:
        draft.coachs.data = action.payload;
      case GET_PROGRAMS:
        draft.programs.loading = true;
        break;
      case GET_PROGRAMS_SUCCESS:
        draft.programs.data = action.payload;
        draft.programs.loading = false;
        break;
      case GET_USER_PROGRAMS:
        draft.programs.loading = true;
        break;
      case GET_USER_PROGRAMS_SUCCESS:
        draft.programs.data = action.payload;
        draft.programs.loading = false;
        break;
      case DELETE_PROGRAM:
        draft.programs.data = state.programs.data.filter(n => n._id !== action.data);
        break;
      case ADD_PROGRAM: 
        draft.programs.data = [...state.programs.data, action.data.data];
        break
      case UPDATE_PROGRAM: 
        const index = state.programs.data.findIndex(c => c._id === action.data.id);
        draft.programs.data[index] = action.data;
        break
      case GET_PROGRAM:
        draft.programDetail.loading = true;
        break;
      case GET_PROGRAM_SUCCESS:
        draft.programDetail.data = action.payload;
        draft.programDetail.loading = false;
        break;
      case GET_PROGRAM_FOR_EDIT:
        draft.programDetail.loading = true;
        break;
      case GET_PROGRAM_FOR_EDIT_SUCCESS:
        draft.programDetail.data = action.payload;
        draft.programDetail.loading = false;
        break;
      case GET_PROGRAM_ERROR:
        draft.programDetail.data = null;
        draft.programDetail.loading = false;
        break;
      default:
        return state;
    }
  });
}
