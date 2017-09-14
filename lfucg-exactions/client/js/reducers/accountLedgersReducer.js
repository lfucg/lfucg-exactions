import {
    GET_ACCOUNT_LEDGERS,
    GET_ACCOUNT_LEDGER_ID,
    GET_ACCOUNT_LEDGER_QUERY,
    GET_LOT_ACCOUNT_LEDGERS,
    GET_ACCOUNT_ACCOUNT_LEDGERS,
    GET_AGREEMENT_ACCOUNT_LEDGERS,
    POST_ACCOUNT_LEDGER,
    PUT_ACCOUNT_LEDGER,
    GET_PAGINATION,
} from '../constants/apiConstants';


const accountLedgersReducer = (state = {}, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case GET_ACCOUNT_LEDGER_ID:
    case GET_ACCOUNT_LEDGERS:
    case GET_ACCOUNT_LEDGER_QUERY:
    case GET_LOT_ACCOUNT_LEDGERS:
    case GET_ACCOUNT_ACCOUNT_LEDGERS:
    case GET_AGREEMENT_ACCOUNT_LEDGERS:
        return action.response;
    case POST_ACCOUNT_LEDGER:
    case PUT_ACCOUNT_LEDGER:
        return {};
    case GET_PAGINATION:
        const next = action.response.next;
        const prev = action.response.prev;
        if ((next != null && next.startsWith('/ledger')) ||
            (prev != null && prev.startsWith('/ledger')) ||
            (window.location.hash === '#/account-ledger')) {
            return action.response;
        }
        return {};
    default:
        return state;
    }
};
export default accountLedgersReducer;
