import { contains } from 'ramda';

import { API_CALL_START } from '../constants/actionTypes';
import { SET_LOADING_FALSE } from '../constants/stateConstants';

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
    next: null,
    count: 0,
    prev: null,
} 

const paymentApiCalls = [GET_PAYMENTS, GET_PAYMENT_ID, GET_LOT_PAYMENTS, GET_ACCOUNT_PAYMENTS, GET_AGREEMENT_PAYMENTS, POST_PAYMENT, PUT_PAYMENT];

const paymentReducer = (state = initialState, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case API_CALL_START:
        if (contains(action.apiCall)(paymentApiCalls) || contains('/payment')(action.apiCall)) {
            return {
                ...state,
                loadingPayment: true,
            };
        }
        return state;
    case GET_PAYMENT_ID:
        return {
            ...state,
            currentPayment: action.response,
            loadingPayment: false,
            next: null,
            count: 1,
            prev: null,
        };
    case GET_PAYMENTS:
    case GET_LOT_PAYMENTS:
    case GET_ACCOUNT_PAYMENTS:
    case GET_AGREEMENT_PAYMENTS:
        return {
            ...state,
            currentPayment: null,
            loadingPayment: false,
            payments: action.response,
            next: action.response.next,
            count: action.response.count,
            prev: action.response.previous,
        }
    case POST_PAYMENT:
    case PUT_PAYMENT:
        return state;
    case GET_PAGINATION:
    case SEARCH_QUERY:
        if (action.response.endpoint === '/payment') {
            return {
                ...state,
                currentPayment: null,
                loadingPayment: false,
                payments: action.response,
                next: action.response.next,
                count: action.response.count,
                prev: action.response.previous,
            }
        }
        return state;
    case SET_LOADING_FALSE:
        if (action.model === 'payment') {
            return {
                ...state,
                loadingPayment: false,
            }
        }
        return state;
    default:
        return state;
    }
};
export default paymentReducer;
