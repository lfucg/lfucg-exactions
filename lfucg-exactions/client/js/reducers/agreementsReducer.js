import {
    GET_AGREEMENTS,
    GET_AGREEMENT_ID,
    GET_ACCOUNT_AGREEMENTS,
    POST_AGREEMENT,
    PUT_AGREEMENT,
    GET_PAGINATION,
    SEARCH_QUERY,
} from '../constants/apiConstants';


const agreementsReducer = (state = [], action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case GET_AGREEMENT_ID:
    case GET_AGREEMENTS:
    case GET_ACCOUNT_AGREEMENTS:
        return action.response;
    case POST_AGREEMENT:
    case PUT_AGREEMENT:
        return {};
    case GET_PAGINATION:
    case SEARCH_QUERY:
        const next = action.response.next;
        const prev = action.response.prev;
        if ((next != null && next.startsWith('/agreement')) ||
            (prev != null && prev.startsWith('/agreement')) ||
            (window.location.hash === '#/agreement')) {
            return action.response;
        }
        return state;
    default:
        return state;
    }
};
export default agreementsReducer;
