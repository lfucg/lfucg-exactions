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
        try {
            localStorage.setItem('Token', action.response.key);
        } catch (e) {
            document.cookie = `Token=${action.response.key}`;
        }
        global.Authorization = action.response.key;
        return action.response;
    case ME:
        return action.response;
    case LOGOUT:
        try {
            localStorage.removeItem('Token');
        } catch (e) {
            document.cookie = 'Token=""';
        }
        return {};
    default:
        return state;
    }
};

export default tokenReducer;
