import {
    GET_PLATS,
    GET_PLAT_ID,
    POST_PLAT,
    PUT_PLAT,
} from '../constants/apiConstants';


const platsReducer = (state = {}, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case GET_PLAT_ID:
        return action.response;
    case GET_PLATS:
        return action.response;
    case POST_PLAT:
        return {};
    case PUT_PLAT:
        return action.response;
    default:
        return state;
    }
};
export default platsReducer;
