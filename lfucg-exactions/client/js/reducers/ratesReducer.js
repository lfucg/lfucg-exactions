import {
    GET_RATES,
    POST_RATE,
    PUT_RATE,
} from '../constants/apiConstants';

const ratesReducer = (state = {}, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case GET_RATES:
        return action.response;
    case POST_RATE:
    case PUT_RATE:
        return {};
    default:
        return state;
    }
};

export default ratesReducer;
