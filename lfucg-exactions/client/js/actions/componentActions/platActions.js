import {
  STATE_CHANGE,
} from '../../constants/stateConstants';

import {
  SET_CURRENT_PLAT,
} from '../../constants/componentConstants/platConstants';

export function setCurrentPlat(plat) {
  return {
    type: STATE_CHANGE,
    endpoint: SET_CURRENT_PLAT,
    plat,
  }
}
