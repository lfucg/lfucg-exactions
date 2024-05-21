import {
  CLEAR_SEARCH,
  UPDATE_SEARCH,
} from '../constants/searchConstants';

export function updateSearch(params) {
  return {
    type: UPDATE_SEARCH,
    params,
  };
}

export function clearSearch(params) {
  return {
    type: CLEAR_SEARCH,
    params,
  };
}
