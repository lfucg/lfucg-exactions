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
        if (action.response.endpoint === '/plat') {
            return action.response;
        }
        return state;
    default:
        return state;
    }
};
export default platsReducer;
