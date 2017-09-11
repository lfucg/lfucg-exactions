import {
    GET_PLATS,
    GET_PLAT_ID,
    GET_PLAT_QUERY,
    GET_SUBDIVISION_PLATS,
    POST_PLAT,
    PUT_PLAT,
    GET_PAGINATION,
} from '../constants/apiConstants';


const platsReducer = (state = {}, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case GET_PLAT_ID:
    case GET_PLATS:
    case GET_PLAT_QUERY:
    case GET_SUBDIVISION_PLATS:
    case PUT_PLAT:
        return action.response;
    case POST_PLAT:
        return {};
    case GET_PAGINATION:
        const next = action.response.next;
        const prev = action.response.prev;
        if (next != null && next.startsWith('/plat')) {
            return action.response;
        }
        if (prev != null && prev.startsWith('/plat')) {
            return action.response;
        }
        return {};
    default:
        return state;
    }
};
export default platsReducer;
