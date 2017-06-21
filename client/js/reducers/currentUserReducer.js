import {
    ME,
    LOGIN,
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
    default:
        return state;
    }
};

export default currentUserReducer;

