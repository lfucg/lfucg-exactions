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
            console.log('TOKEN LOGIN', action.response);
            localStorage.setItem('Token', action.response.key);
        } catch (e) {
            console.log('ERROR ', e);
            const date = new Date();
            date.setTime(date.getTime() + (3 * 24 * 60 * 60 * 1000));
            const date_expires = date.toGMTString();
            document.cookie = `Token=${action.response.key}; expires=${date_expires}`;
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
