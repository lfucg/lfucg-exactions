import {
  STATE_CHANGE,
} from '../../constants/stateConstants';

import {
  SET_CURRENT_LOT,
} from '../../constants/componentConstants/lotConstants';

export function setCurrentLot(lot) {
  return {
    type: STATE_CHANGE,
    endpoint: SET_CURRENT_LOT,
    lot,
  }
}
