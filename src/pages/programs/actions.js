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
  GET_PROGRAM_FOR_EDIT_SUCCESS,
  GET_PROGRAM_FOR_EDIT,
  GET_COACHS_SUCCESS,
  GET_COACHS,
  UNREGISTER,
  REGISTER,
  GET_USER_PROGRAMS
} from "./constants";

export const register = data => ({type: REGISTER, data});
export const unregister = data => ({type: UNREGISTER, data});

export const getCoachs = data => ({type: GET_COACHS, data});


export const getCoachsSuccess = payload => ({type: GET_COACHS_SUCCESS, payload});

export const getUserPrograms = data => ({type: GET_USER_PROGRAMS, data});
export const getPrograms = data => ({type: GET_PROGRAMS, data});
export const getProgramsSuccess = payload => ({type: GET_PROGRAMS_SUCCESS, payload});

export const deleteProgram = data => ({type: DELETE_PROGRAM, data});
export const deleteProgramSuccess = payload => ({type: DELETE_PROGRAM_SUCCESS, payload});

export const editProgram = data => ({type: UPDATE_PROGRAM, data});
export const editProgramSuccess = payload => ({type: UPDATE_PROGRAM_SUCCESS, payload});

export const addProgram = data => ({type: ADD_PROGRAM, data});
export const addProgramSuccess = payload => ({type: ADD_PROGRAM_SUCCESS, payload});

export const getProgram = data => ({type: GET_PROGRAM, data});
export const getProgramSuccess = payload => ({type: GET_PROGRAM_SUCCESS, payload});

export const getProgramForEdit = data => ({type: GET_PROGRAM_FOR_EDIT, data});
export const getProgramForEditSuccess = payload => ({type: GET_PROGRAM_FOR_EDIT_SUCCESS, payload});

export const getProgramError = err => ({type: GET_PROGRAM_ERROR, err});