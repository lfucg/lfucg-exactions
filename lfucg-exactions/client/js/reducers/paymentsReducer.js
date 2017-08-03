import {
    GET_PAYMENTS,
    GET_PAYMENT_ID,
    GET_PAYMENT_QUERY,
    POST_PAYMENT,
    PUT_PAYMENT,
} from '../constants/apiConstants';


const paymentReducer = (state = {}, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case GET_PAYMENT_ID:
        return action.response;
    case GET_PAYMENTS:
        return action.response;
    case GET_PAYMENT_QUERY:
        return action.response;
    case POST_PAYMENT:
        return {};
    case PUT_PAYMENT:
        return {};
    default:
        return state;
    }
};
export default paymentReducer;
