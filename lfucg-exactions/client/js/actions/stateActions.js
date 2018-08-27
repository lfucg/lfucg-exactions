import {
  STATE_CHANGE,
  SET_LOADING_FALSE,
} from '../constants/stateConstants';

export function setLoadingFalse(model) {
  return {
    type: STATE_CHANGE,
    endpoint: SET_LOADING_FALSE,
    model,
  };
}
