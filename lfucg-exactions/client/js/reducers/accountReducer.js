import {
    GET_ACCOUNTS,
    GET_ACCOUNT_ID,
    GET_ACCOUNT_QUERY,
    POST_ACCOUNT,
    PUT_ACCOUNT,
    GET_PAGINATION,
} from '../constants/apiConstants';


const accountReducer = (state = {}, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case GET_ACCOUNT_ID:
    case GET_ACCOUNTS:
        return action.response;
    case POST_ACCOUNT:
    case PUT_ACCOUNT:
        return {};
    case GET_ACCOUNT_QUERY:
    case GET_PAGINATION:
        const next = action.response.next;
        const prev = action.response.prev;
        if ((next != null && next.startsWith('/account')) ||
            (prev != null && prev.startsWith('/account')) ||
            (window.location.hash === '#/account')) {
            return action.response;
        }
        return {};
    default:
        return state;
    }
};
export default accountReducer;
