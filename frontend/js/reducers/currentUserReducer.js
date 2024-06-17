import { map } from 'ramda';

import {
    ME,
    LOGIN,
    LOGOUT,
} from '../constants/apiConstants';

const currentUserReducer = (state = {}, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case ME:
        return {
            ...state,
            ...action.response,
            userGroups: !!action.response && map(
                (group) => group.name,
            )(action.response.groups),
        };
    case LOGIN:
        return action.response.user;
    case LOGOUT:
        return {};
    default:
        return state;
    }
};

export default currentUserReducer;

