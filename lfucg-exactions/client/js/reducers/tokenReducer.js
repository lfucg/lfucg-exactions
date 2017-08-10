import {
    LOGIN,
    LOGOUT,
    ME,
} from '../constants/apiConstants';

const tokenReducer = (state = {}, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case LOGIN:
    case ME:
        return action.response;
    case LOGOUT:
        return {};
    default:
        return state;
    }
};

export default tokenReducer;
