import {
    GET_PROJECT_COSTS,
    GET_PROJECT_COST_ID,
    GET_PROJECT_COST_QUERY,
    POST_PROJECT_COST,
    PUT_PROJECT_COST,
} from '../constants/apiConstants';


const projectCostsReducer = (state = {}, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case GET_PROJECT_COST_ID:
    case GET_PROJECT_COSTS:
    case GET_PROJECT_COST_QUERY:
        return action.response;
    case POST_PROJECT_COST:
    case PUT_PROJECT_COST:
        return {};
    default:
        return state;
    }
};
export default projectCostsReducer;
