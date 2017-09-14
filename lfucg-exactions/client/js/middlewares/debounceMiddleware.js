import { getAccounts } from '../actions/apiActions';

import { DELAY_API_CALL } from '../constants/actionTypes';

export default function debounceMiddleware({ dispatch }) {
    return next => (action) => {
        if (action.type === DELAY_API_CALL) {

        }

        return next(action);
    };
}
