import { contains, map, mapObjIndexed } from 'ramda';

import { API_CALL_START } from '../constants/actionTypes';
import { SET_LOADING_FALSE } from '../constants/stateConstants';

import {
    GET_ACCOUNTS,
    GET_ACCOUNTS_QUICK,
    GET_ACCOUNT_ID,
    GET_LEDGER_ACCOUNT_TO,
    GET_LEDGER_ACCOUNT_FROM,
    POST_ACCOUNT,
    PUT_ACCOUNT,
    GET_PAGINATION,
    SEARCH_QUERY,
} from '../constants/apiConstants';

const initialState = {
    currentAccount: null,
    loadingAccount: true,
    balanceAvailable: 'No Credit Available',
    accounts: [],
    accountTo: null,
    accountFrom: null,
    next: null,
    count: 0,
    prev: null,
}

const accountApiCalls = [GET_ACCOUNTS, GET_ACCOUNTS_QUICK, GET_ACCOUNT_ID, POST_ACCOUNT, PUT_ACCOUNT];

const convertCurrency = (accounts) => {
    let newAccountList = [];
    const accountCurrencyFields = ['current_account_balance', 'current_non_sewer_balance', 'current_sewer_balance'];

    if (!!accounts && !accounts.length) {
        newAccountList = accounts;
        mapObjIndexed((value) => {
            const field_value = parseFloat(accounts[value]);
            accounts[value] = field_value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        })(accountCurrencyFields);
    } else {
        newAccountList = map((account) => {

            mapObjIndexed((value) => {
                const field_value = parseFloat(account[value]);
                account[value] = field_value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
            })(accountCurrencyFields);

            return account;
        })(accounts)
    }

    return newAccountList;
}

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
            accountTo: null,
            accountFrom: null,
            currentAccount: convertCurrency(action.response),
            balanceAvailable: action.response.current_account_balance > 0 ? 'Credit Available' : 'No Credit Available',
            loadingAccount: false,
            next: null,
            count: 1,
            prev: null,
        };
    case GET_ACCOUNTS:
        return {
            ...state,
            accountTo: null,
            accountFrom: null,
            accounts: convertCurrency(action.response),
            currentAccount: null,
            balanceAvailable: action.response.current_account_balance > 0 ? 'Credit Available' : 'No Credit Available',
            loadingAccount: false,
            next: action.response.next,
            count: action.response.count,
            prev: action.response.previous,
        }
    case GET_ACCOUNTS_QUICK:
        return {
            ...state,
            accountTo: null,
            accountFrom: null,
            currentAccount: null,
            balanceAvailable: action.response.current_account_balance > 0 ? 'Credit Available' : 'No Credit Available',
            loadingAccount: false,
            next: null,
            count: 0,
            accounts: convertCurrency(action.response),
            prev: null,
        };
    case GET_LEDGER_ACCOUNT_FROM:
        return {
            ...state,
            accountFrom: action.response[0],
        };
    case GET_LEDGER_ACCOUNT_TO:
        return {
            ...state,
            accountTo: action.response[0],
        };
    case POST_ACCOUNT:
    case PUT_ACCOUNT:
        return state;
    case SEARCH_QUERY:
    case GET_PAGINATION:
        if (action.response.endpoint === '/account') {
            return {
                ...state,
                accounts: convertCurrency(action.response),
                currentAccount: null,
                balanceAvailable: action.response.current_account_balance > 0 ? 'Credit Available' : 'No Credit Available',
                loadingAccount: false,
                next: action.response.next,
                count: action.response.count,
                prev: action.response.previous,
            }
        }
        return state;
    case SET_LOADING_FALSE:
        if (action.model === 'account') {
            return {
                ...state,
                loadingAccount: false,
            }
        }
        return state;
    default:
        return state;
    }
};
export default accountReducer;
