import {
    GET_PROJECT_COSTS,
    GET_PROJECT_COST_ID,
    GET_PROJECT_COST_QUERY,
    POST_PROJECT_COST,
    PUT_PROJECT_COST,
    GET_PAGINATION,
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
    case GET_PAGINATION:
        const next = action.response.next;
        const prev = action.response.prev;
        if ((next != null && next.startsWith('/estimate')) ||
            (prev != null && prev.startsWith('/estimate')) ||
            (window.location.hash === '#/project-cost')) {
            return action.response;
        }
        return state;
    default:
        return state;
    }
};
export default projectCostsReducer;
