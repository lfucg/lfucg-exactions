import {
    GET_AGREEMENTS,
    GET_AGREEMENT_ID,
    GET_AGREEMENT_QUERY,
    GET_ACCOUNT_AGREEMENTS,
    POST_AGREEMENT,
    PUT_AGREEMENT,
} from '../constants/apiConstants';


const agreementsReducer = (state = {}, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case GET_AGREEMENT_ID:
    case GET_AGREEMENTS:
    case GET_AGREEMENT_QUERY:
    case GET_ACCOUNT_AGREEMENTS:
        return action.response;
    case POST_AGREEMENT:
    case PUT_AGREEMENT:
        return {};
    default:
        return state;
    }
};
export default agreementsReducer;
