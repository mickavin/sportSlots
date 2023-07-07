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
} from "./constants";

export const getSports = data => ({type: GET_SPORTS, data});
export const getSportsForFilter = data => ({type: GET_SPORTS_FOR_FILTER, data});

export const getSportsSuccess = payload => ({type: GET_SPORTS_SUCCESS, payload});

export const deleteSport = data => ({type: DELETE_SPORT, data});
export const deleteSportSuccess = payload => ({type: DELETE_SPORT_SUCCESS, payload});

export const editSport = data => ({type: UPDATE_SPORT, data});
export const editSportSuccess = payload => ({type: UPDATE_SPORT_SUCCESS, payload});

export const addSport = data => ({type: ADD_SPORT, data});
export const addSportSuccess = payload => ({type: ADD_SPORT_SUCCESS, payload});

export const getSport = data => ({type: GET_SPORT, data});
export const getSportSuccess = payload => ({type: GET_SPORT_SUCCESS, payload});
export const getSportError = err => ({type: GET_SPORT_ERROR, err});