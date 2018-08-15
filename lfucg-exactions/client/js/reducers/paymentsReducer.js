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

const initialState = {
    currentPayment: null,
    loadingPayment: true,
    payments: [],
} 

const paymentReducer = (state = initialState, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case GET_PAYMENT_ID:
        return {
            ...state,
            currentPayment: action.response,
            loadingPayment: false,
        };
    case GET_PAYMENTS:
    case GET_LOT_PAYMENTS:
    case GET_ACCOUNT_PAYMENTS:
    case GET_AGREEMENT_PAYMENTS:
        return {
            ...state,
            payments: action.response,
            loadingPayment: false,
        }
    case POST_PAYMENT:
    case PUT_PAYMENT:
        return {};
    case GET_PAGINATION:
    case SEARCH_QUERY:
        if (action.response.endpoint === '/payment') {
            return {
                ...state,
                payments: action.response,
                loadingPayment: false,
            }
        }
        return state;
    default:
        return state;
    }
};
export default paymentReducer;
