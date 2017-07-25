import {
    GET_SUBDIVISIONS,
    GET_SUBDIVISION_ID,
    GET_SUBDIVISION_QUERY,
    POST_SUBDIVISION,
    PUT_SUBDIVISION,
} from '../constants/apiConstants';


const subdivisionsReducer = (state = {}, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case GET_SUBDIVISION_ID:
        return action.response;
    case GET_SUBDIVISIONS:
        return action.response;
    case GET_SUBDIVISION_QUERY:
        return action.response;
    case POST_SUBDIVISION:
        return {};
    case PUT_SUBDIVISION:
        return {};
    default:
        return state;
    }
};
export default subdivisionsReducer;
