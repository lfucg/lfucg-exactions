import {
    GET_PAYMENTS,
    GET_PAYMENT_ID,
    GET_PAYMENT_QUERY,
    GET_LOT_PAYMENTS,
    GET_ACCOUNT_PAYMENTS,
    GET_AGREEMENT_PAYMENTS,
    POST_PAYMENT,
    PUT_PAYMENT,
    GET_PAGINATION,
} from '../constants/apiConstants';


const paymentReducer = (state = {}, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case GET_PAYMENT_ID:
    case GET_PAYMENTS:
    case GET_PAYMENT_QUERY:
    case GET_LOT_PAYMENTS:
    case GET_ACCOUNT_PAYMENTS:
    case GET_AGREEMENT_PAYMENTS:
        return action.response;
    case POST_PAYMENT:
    case PUT_PAYMENT:
        return {};
    case GET_PAGINATION:
        const next = action.response.next;
        const prev = action.response.prev;
        if ((next != null && next.startsWith('/payment')) ||
            (prev != null && prev.startsWith('/payment')) ||
            (window.location.hash === '#/payment')) {
            return action.response;
        }
        return {};
    default:
        return state;
    }
};
export default paymentReducer;
