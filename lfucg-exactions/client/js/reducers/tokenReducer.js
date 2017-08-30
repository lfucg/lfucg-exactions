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
        localStorage.setItem('Token', action.response.key);
        global.Authorization = action.response.key;
        return action.response;
    case ME:
        return action.response;
    case LOGOUT:
        localStorage.removeItem('Token');
        return {};
    default:
        return state;
    }
};

export default tokenReducer;
