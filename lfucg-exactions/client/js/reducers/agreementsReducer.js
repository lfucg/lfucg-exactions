import {
    GET_AGREEMENTS,
    GET_AGREEMENT_ID,
    GET_AGREEMENT_QUERY,
    POST_AGREEMENT,
    PUT_AGREEMENT,
} from '../constants/apiConstants';


const agreementsReducer = (state = {}, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case GET_AGREEMENT_ID:
        return action.response;
    case GET_AGREEMENTS:
        return action.response;
    case GET_AGREEMENT_QUERY:
        return action.response;
    case POST_AGREEMENT:
        return {};
    case PUT_AGREEMENT:
        return {};
    default:
        return state;
    }
};
export default agreementsReducer;
