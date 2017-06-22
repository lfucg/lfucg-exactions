import {
    LOGIN,
    LOGOUT,
} from '../constants/apiConstants';

const tokenReducer = (state = {}, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case LOGIN:
        return action.response;
    case LOGOUT:
        return {};
    default:
        return state;
    }
};

export default tokenReducer;
