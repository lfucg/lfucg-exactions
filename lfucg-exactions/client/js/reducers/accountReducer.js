import {
    GET_ACCOUNTS,
    GET_ACCOUNT_ID,
    GET_ACCOUNT_QUERY,
    POST_ACCOUNT,
    PUT_ACCOUNT,
} from '../constants/apiConstants';


const accountReducer = (state = {}, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case GET_ACCOUNT_ID:
    case GET_ACCOUNTS:
    case GET_ACCOUNT_QUERY:
        const response = action.response.results;
        response.next = action.response.next;
        response.prev = action.response.previous;
        response.count = action.response.count;
        return response;
    case POST_ACCOUNT:
    case PUT_ACCOUNT:
        return {};
    default:
        return state;
    }
};
export default accountReducer;
