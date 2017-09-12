import {
    GET_LOTS,
    GET_LOT_ID,
    GET_LOT_QUERY,
    GET_PLAT_LOTS,
    POST_LOT,
    PUT_LOT,
    GET_PAGINATION,
} from '../constants/apiConstants';


const lotsReducer = (state = {}, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case GET_LOT_ID:
    case GET_LOTS:
    case GET_LOT_QUERY:
    case GET_PLAT_LOTS:
    case POST_LOT:
    case PUT_LOT:
        return action.response;
    case GET_PAGINATION:
        const next = action.response.next;
        const prev = action.response.prev;
        if ((next != null && next.startsWith('/lot')) ||
            (prev != null && prev.startsWith('/lot')) ||
            (window.location.hash === '#/lot')) {
            return action.response;
        }
        return {};
    default:
        return state;
    }
};
export default lotsReducer;
