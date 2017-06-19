import { merge } from 'ramda';

import {
    FORM_INIT,
    FORM_UPDATE,
    FORM_RESET,
    CURRENT_JOB_UPDATE,
} from '../constants/actionTypes';

export default function activeFormReducer(state = {}, action) {
    switch (action.type) {
    case FORM_INIT:
        return {
            currentJobUpdate: false,
        };
    case FORM_RESET:
        return {};
    case FORM_UPDATE:
        return merge(state, action.update);
    case CURRENT_JOB_UPDATE:
        return Object.assign({}, state, {
            currentJobUpdate: !state.currentJobUpdate,
        });
    default:
    }

    return state;
}
