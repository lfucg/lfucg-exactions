import {
    GET_PAYMENTS,
    GET_PAYMENT_ID,
    GET_LOT_PAYMENTS,
    GET_ACCOUNT_PAYMENTS,
    GET_AGREEMENT_PAYMENTS,
    POST_PAYMENT,
    PUT_PAYMENT,
    GET_PAGINATION,
    SEARCH_QUERY,
} from '../constants/apiConstants';


const paymentReducer = (state = [], action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case GET_PAYMENT_ID:
    case GET_PAYMENTS:
    case GET_LOT_PAYMENTS:
    case GET_ACCOUNT_PAYMENTS:
    case GET_AGREEMENT_PAYMENTS:
        return action.response;
    case POST_PAYMENT:
    case PUT_PAYMENT:
        return {};
    case GET_PAGINATION:
    case SEARCH_QUERY:
        if (action.response.endpoint === '/payment') {
            return action.response;
        }
        return state;
    default:
        return state;
    }
};
export default paymentReducer;
