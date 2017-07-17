import {
    GET_LOTS,
    GET_LOT_ID,
    POST_LOT,
    PUT_LOT,
} from '../constants/apiConstants';


const lotsReducer = (state = {}, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case GET_LOT_ID:
        return action.response;
    case GET_LOTS:
        return action.response;
    case POST_LOT:
        return action.response;
    case PUT_LOT:
        return action.response;
    default:
        return state;
    }
};
export default lotsReducer;
