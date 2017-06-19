import {
    LOGIN,
} from '../constants/apiConstants';

const tokenReducer = (state = {}, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case LOGIN:
        return action.response;
    default:
        return state;
    }
};

export default tokenReducer;
