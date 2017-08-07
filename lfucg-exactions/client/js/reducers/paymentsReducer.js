import {
    GET_PAYMENTS,
    GET_PAYMENT_ID,
    GET_PAYMENT_QUERY,
    GET_LOT_PAYMENTS,
    GET_ACCOUNT_PAYMENTS,
    GET_AGREEMENT_PAYMENTS,
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
    case GET_LOT_PAYMENTS:
        return action.response;
    case GET_ACCOUNT_PAYMENTS:
        return action.response;
    case GET_AGREEMENT_PAYMENTS:
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
