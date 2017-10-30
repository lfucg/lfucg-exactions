import {
    GET_PLATS,
    GET_PLAT_ID,
    GET_SUBDIVISION_PLATS,
    POST_PLAT,
    PUT_PLAT,
    GET_PAGINATION,
    SEARCH_QUERY,
} from '../constants/apiConstants';


const platsReducer = (state = [], action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case GET_PLAT_ID:
    case GET_PLATS:
    case GET_SUBDIVISION_PLATS:
    case PUT_PLAT:
        return action.response;
    case POST_PLAT:
        return {};
    case GET_PAGINATION:
    case SEARCH_QUERY:
        const next = action.response.next;
        const prev = action.response.prev;
        if ((next != null && next.substr(0, next.length) === '/plat') ||
            (prev != null && prev.substr(0, prev.length) === '/plat') ||
            (window.location.hash === '#/plat')) {
            return action.response;
        }
        return state;
    default:
        return state;
    }
};
export default platsReducer;
