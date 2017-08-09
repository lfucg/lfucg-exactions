import {
    GET_ACCOUNT_LEDGERS,
    GET_ACCOUNT_LEDGER_ID,
    GET_ACCOUNT_LEDGER_QUERY,
    GET_LOT_ACCOUNT_LEDGERS,
    GET_ACCOUNT_ACCOUNT_LEDGERS,
    GET_AGREEMENT_ACCOUNT_LEDGERS,
    POST_ACCOUNT_LEDGER,
    PUT_ACCOUNT_LEDGER,
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
    default:
        return state;
    }
};
export default accountLedgersReducer;
