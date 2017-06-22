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
        return action.response;
    case LOGIN:
        return action.response.user;
    case LOGOUT:
        return {};
    default:
        return state;
    }
};

export default currentUserReducer;

