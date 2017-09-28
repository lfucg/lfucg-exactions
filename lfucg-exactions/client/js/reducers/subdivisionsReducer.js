import {
    GET_SUBDIVISIONS,
    GET_SUBDIVISION_ID,
    POST_SUBDIVISION,
    PUT_SUBDIVISION,
    GET_PAGINATION,
    SEARCH_QUERY,
} from '../constants/apiConstants';


const subdivisionsReducer = (state = {}, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case GET_SUBDIVISION_ID:
    case GET_SUBDIVISIONS:
        return action.response;
    case POST_SUBDIVISION:
    case PUT_SUBDIVISION:
        return {};
    case GET_PAGINATION:
    case SEARCH_QUERY:
        const next = action.response.next;
        const prev = action.response.prev;
        if ((next != null && next.startsWith('/subdivision')) ||
            (prev != null && prev.startsWith('/subdivision')) ||
            (window.location.hash === '#/subdivision')) {
            return action.response;
        }
        return state;
    default:
        return state;
    }
};
export default subdivisionsReducer;
