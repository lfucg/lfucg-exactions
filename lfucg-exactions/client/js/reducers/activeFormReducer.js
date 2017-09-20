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
        map((entry) => {
            if (entry[1] && entry[0].startsWith('filter')) {
                delete state[entry[0]];
            }
        })(Object.entries(state));
        return merge(state, action.update);
    case API_CALL_SUCCESS:
        if (action.endpoint === 'GET_PAGINATION' || action.endpoint.includes('QUERY')) {
            return merge(state, { next: action.response.next, prev: action.response.prev, count: action.response.count });
        }
        return state;
    case FORM_UPDATE:
        return merge(state, action.update);
    default:
    }
    return state;
}
