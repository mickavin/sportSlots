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
  REGISTER,
  UNREGISTER,
  REGISTER_SUCCESS,
  UNREGISTER_SUCCESS,
} from "./constants";

export const getCompanies = data => ({type: GET_COMPANIES, data});
export const getCompaniesSuccess = payload => ({type: GET_COMPANIES_SUCCESS, payload});

export const deleteCompany = data => ({type: DELETE_COMPANY, data});
export const deleteCompanySuccess = payload => ({type: DELETE_COMPANY_SUCCESS, payload});

export const editCompany = data => ({type: UPDATE_COMPANY, data});
export const editCompanySuccess = payload => ({type: UPDATE_COMPANY_SUCCESS, payload});

export const addCompany = data => ({type: ADD_COMPANY, data});
export const addCompanySuccess = payload => ({type: ADD_COMPANY_SUCCESS, payload});

export const getCompany = data => ({type: GET_COMPANY, data});
export const getCompanySuccess = payload => ({type: GET_COMPANY_SUCCESS, payload});
export const getCompanyError = err => ({type: GET_COMPANY_ERROR, err});

export const register = data => ({type: REGISTER, data});
export const unregister = data => ({type: UNREGISTER, data});
export const registerSuccess = data => ({type: REGISTER_SUCCESS, data});
export const unregisterSuccess = data => ({type: UNREGISTER_SUCCESS, data});
