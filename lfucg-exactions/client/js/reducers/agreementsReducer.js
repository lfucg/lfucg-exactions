import { contains } from 'ramda';

import { API_CALL_START } from '../constants/actionTypes';
import { SET_LOADING_FALSE } from '../constants/stateConstants';

import {
    GET_AGREEMENTS,
    GET_AGREEMENT_ID,
    GET_AGREEMENTS_QUICK,
    GET_ACCOUNT_AGREEMENTS,
    GET_LEDGER_AGREEMENT,
    POST_AGREEMENT,
    PUT_AGREEMENT,
    GET_PAGINATION,
    SEARCH_QUERY,
} from '../constants/apiConstants';

const initialState = {
    currentAgreement: null,
    loadingAgreement: true,
    agreements: [],
    next: null,
    count: 0,
    prev: null,
}

const agreementApiCalls = [GET_AGREEMENTS, GET_AGREEMENT_ID, GET_AGREEMENTS_QUICK, GET_ACCOUNT_AGREEMENTS, POST_AGREEMENT, PUT_AGREEMENT];

const agreementsReducer = (state = initialState, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case API_CALL_START:
        if (contains(action.apiCall)(agreementApiCalls) || contains('/agreement')(action.apiCall)) {
            return {
                ...state,
                loadingAgreement: true,
            };
        }
        return state;
    case GET_AGREEMENT_ID:
        return {
            ...state,
            currentAgreement: action.response,
            loadingAgreement: false,
            next: null,
            count: 1,
            prev: null,
        }
    case GET_LEDGER_AGREEMENT:
        return {
            ...state,
            currentAgreement: action.response[0],
            loadingAgreement: false,
            next: null,
            count: 1,
            prev: null,
        }
    case GET_AGREEMENTS:
    case GET_ACCOUNT_AGREEMENTS:
        return {
            ...state,
            currentAgreement: null,
            agreements: action.response,
            loadingAgreement: false,
            next: action.response.next,
            count: action.response.count,
            prev: action.response.previous,
        }
    case GET_AGREEMENTS_QUICK:
        return {
            ...state,
            currentAgreement: null,
            loadingAgreement: false,
            next: null,
            count: 0,
            agreements: action.response,
            prev: null,
        };
    case POST_AGREEMENT:
    case PUT_AGREEMENT:
        return state;
    case GET_PAGINATION:
    case SEARCH_QUERY:
        if (action.response.endpoint === '/agreement') {
            return {
                ...state,
                currentAgreement: null,
                agreements: action.response,
                loadingAgreement: false,
                next: action.response.next,
                count: action.response.count,
                prev: action.response.previous,
            }
        }
        return state;
    case SET_LOADING_FALSE:
        if (action.model === 'agreement') {
            return {
                ...state,
                loadingAgreement: false,
            }
        }
        return state;
    default:
        return state;
    }
};
export default agreementsReducer;
