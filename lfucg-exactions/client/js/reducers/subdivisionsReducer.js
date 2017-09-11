import {
    GET_SUBDIVISIONS,
    GET_SUBDIVISION_ID,
    GET_SUBDIVISION_QUERY,
    POST_SUBDIVISION,
    PUT_SUBDIVISION,
    GET_PAGINATION,
} from '../constants/apiConstants';


const subdivisionsReducer = (state = {}, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case GET_SUBDIVISION_ID:
    case GET_SUBDIVISIONS:
    case GET_SUBDIVISION_QUERY:
        return action.response;
    case POST_SUBDIVISION:
    case PUT_SUBDIVISION:
        return {};
    case GET_PAGINATION:
        const next = action.response.next;
        const prev = action.response.prev;
        if ((next != null && next.startsWith('/subdivision')) ||
            (prev != null && prev.startsWith('/subdivision')) ||
            (window.location.hash === '#/subdivision')) {
            return action.response;
        }
        return {};
    default:
        return state;
    }
};
export default subdivisionsReducer;
