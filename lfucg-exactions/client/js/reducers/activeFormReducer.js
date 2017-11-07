import { merge, map } from 'ramda';

import {
    FORM_INIT,
    FORM_UPDATE,
    FORM_RESET,
    API_CALL_SUCCESS,
} from '../constants/actionTypes';

export default function activeFormReducer(state = {}, action) {
    switch (action.type) {
    case FORM_INIT:
        return {};
    case FORM_RESET:
        map((key_name) => {
            if (key_name.indexOf('filter') !== -1) {
                delete state[key_name];
            }
        })(Object.keys(state));
        return merge(state, action.update);
    case API_CALL_SUCCESS:
        if (action.endpoint === 'GET_PAGINATION' || (action.endpoint.indexOf('QUERY') !== -1)) {
            let location = window.location.hash.slice(1);

            if (location === '/credit-transfer') {
                location = '/ledger';
            }

            if (location === '/project-cost') {
                location = '/estimate';
            }

            if (location === action.response.endpoint) {
                const currentPage = `${location}/`;
                return merge(state, { next: action.response.next, prev: action.response.prev, count: action.response.count, currentPage });
            }
        }
        return state;
    case FORM_UPDATE:
        return merge(state, action.update);
    default:
    }
    return state;
}
