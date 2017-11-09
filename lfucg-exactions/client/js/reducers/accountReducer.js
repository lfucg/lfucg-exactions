import {
    GET_ACCOUNTS,
    GET_ACCOUNT_ID,
    POST_ACCOUNT,
    PUT_ACCOUNT,
    GET_PAGINATION,
    SEARCH_QUERY,
} from '../constants/apiConstants';


const accountReducer = (state = [], action) => {
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
    case SEARCH_QUERY:
    case GET_PAGINATION:
        if (action.response.endpoint === '/account') {
            return action.response;
        }
        return state;
    default:
        return state;
    }
};
export default accountReducer;
