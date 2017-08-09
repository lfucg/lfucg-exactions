import { merge } from 'ramda';

import {
    FORM_INIT,
    FORM_UPDATE,
    FORM_RESET,
} from '../constants/actionTypes';

export default function activeFormReducer(state = {}, action) {
    switch (action.type) {
    case FORM_INIT:
    case FORM_RESET:
        return {};
    case FORM_UPDATE:
        return merge(state, action.update);
    default:
    }

    return state;
}
