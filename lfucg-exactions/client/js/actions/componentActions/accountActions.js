import {
  STATE_CHANGE,
} from '../../constants/stateConstants';

import {
  SET_ACCOUNT_FROM,
  SET_ACCOUNT_TO,
} from '../../constants/componentConstants/accountConstants';

export function setAccountFrom(account) {
  return {
    type: STATE_CHANGE,
    endpoint: SET_ACCOUNT_FROM,
    account,
  }
}

export function setAccountTo(account) {
  return {
    type: STATE_CHANGE,
    endpoint: SET_ACCOUNT_TO,
    account,
  }
}
