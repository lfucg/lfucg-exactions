import { contains } from 'ramda';

import {
    API_CALL_START,
} from '../constants/actionTypes';

import {
    GET_ACCOUNTS,
    GET_ACCOUNTS_QUICK,
    GET_ACCOUNT_ID,
    POST_ACCOUNT,
    PUT_ACCOUNT,
    GET_PAGINATION,
    SEARCH_QUERY,
} from '../constants/apiConstants';

const initialState = {
    currentAccount: null,
    loadingAccount: true,
    accounts: [],
    next: null,
    count: 0,
    prev: null,
}

const accountApiCalls = [];

const accountReducer = (state = initialState, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case API_CALL_START:
        if (contains(action.apiCall)(accountApiCalls) || contains('/account')(action.apiCall)) {
            return {
                ...state,
                loadingAccount: true,
            };
        }
        return state;
    case GET_ACCOUNT_ID:
        return {
            ...state,
            currentAccount: action.response,
            loadingAccount: false,
            next: null,
            count: 1,
            prev: null,
        };
    case GET_ACCOUNTS:
        return {
            ...state,
            accounts: action.response,
            currentAccount: null,
            loadingAccount: false,
            next: action.response.next,
            count: action.response.count,
            prev: action.response.previous,
        }
    case GET_ACCOUNTS_QUICK:
        return {
            ...state,
            currentAccount: null,
            loadingAccount: false,
            next: null,
            count: 0,
            accounts: action.response,
            prev: null,
        };
    case POST_ACCOUNT:
    case PUT_ACCOUNT:
        return {};
    case SEARCH_QUERY:
    case GET_PAGINATION:
        if (action.response.endpoint === '/account') {
            return {
                ...state,
                accounts: action.response,
                currentAccount: null,
                loadingAccount: false,
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
export default accountReducer;
