import {
    ME,
} from '../constants/apiConstants';

const currentUserReducer = (state = {}, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case ME:
        return action.response;
    default:
        return state;
    }
};

export default currentUserReducer;

