import {
  STATE_CHANGE,
} from '../../constants/stateConstants';

import {
  SET_CURRENT_AGREEMENT,
} from '../../constants/componentConstants/agreementConstants';

export function setCurrentAgreement(agreement) {
  return {
    type: STATE_CHANGE,
    endpoint: SET_CURRENT_AGREEMENT,
    agreement,
  }
}
