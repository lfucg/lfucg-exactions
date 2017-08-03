import {
    GET_ACCOUNT_LEDGERS,
    GET_ACCOUNT_LEDGER_ID,
    GET_ACCOUNT_LEDGER_QUERY,
    POST_ACCOUNT_LEDGER,
    PUT_ACCOUNT_LEDGER,
} from '../constants/apiConstants';


const accountLedgersReducer = (state = {}, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case GET_ACCOUNT_LEDGER_ID:
        return action.response;
    case GET_ACCOUNT_LEDGERS:
        return action.response;
    case GET_ACCOUNT_LEDGER_QUERY:
        return action.response;
    case POST_ACCOUNT_LEDGER:
        return {};
    case PUT_ACCOUNT_LEDGER:
        return {};
    default:
        return state;
    }
};
export default accountLedgersReducer;
