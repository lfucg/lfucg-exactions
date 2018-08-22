import { contains } from 'ramda';

import {
    API_CALL_START,
} from '../constants/actionTypes';

import {
    GET_ACCOUNT_LEDGERS,
    GET_ACCOUNT_LEDGER_ID,
    GET_LOT_ACCOUNT_LEDGERS,
    GET_ACCOUNT_ACCOUNT_LEDGERS,
    GET_AGREEMENT_ACCOUNT_LEDGERS,
    POST_ACCOUNT_LEDGER,
    PUT_ACCOUNT_LEDGER,
    GET_PAGINATION,
    SEARCH_QUERY,
} from '../constants/apiConstants';

const initialState = {
    currentLedger: null,
    loadingLedger: true,
    accountLedgers: [],
    next: null,
    count: 0,
    prev: null,
} 

const accountLedgerApiCalls = [];

const accountLedgersReducer = (state = initialState, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case API_CALL_START:
        if (contains(action.apiCall)(accountLedgerApiCalls) || contains('/ledger')(action.apiCall)) {
            return {
                ...state,
                loadingLedger: true,
            };
        }
        return state;
    case GET_ACCOUNT_LEDGER_ID:
        return {
            ...state,
            currentLedger: action.response,
            loadingLedger: false,
            next: action.response.next,
            count: action.response.count,
            prev: action.response.previous,
        };
    case GET_ACCOUNT_LEDGERS:
    case GET_LOT_ACCOUNT_LEDGERS:
    case GET_ACCOUNT_ACCOUNT_LEDGERS:
    case GET_AGREEMENT_ACCOUNT_LEDGERS:
        return {
            ...state,
            accountLedgers: action.response,
            currentLedger: null,
            loadingLedger: false,
            next: action.response.next,
            count: action.response.count,
            prev: action.response.previous,
        }
    case POST_ACCOUNT_LEDGER:
    case PUT_ACCOUNT_LEDGER:
        return {};
    case GET_PAGINATION:
    case SEARCH_QUERY:
        if (action.response.endpoint === '/ledger') {
            return {
                ...state,
                accountLedgers: action.response,
                currentLedger: null,
                loadingLedger: false,
                next: action.response.next,
                count: action.response.count,
                prev: action.response.previous,
            }
        }
        return state;
    default:
        return state;
    }
};
export default accountLedgersReducer;
