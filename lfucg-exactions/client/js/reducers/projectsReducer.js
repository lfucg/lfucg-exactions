import {
    GET_PROJECTS,
    GET_PROJECT_ID,
    GET_PROJECT_QUERY,
    GET_AGREEMENT_PROJECTS,
    POST_PROJECT,
    PUT_PROJECT,
    GET_PAGINATION,
} from '../constants/apiConstants';


const projectsReducer = (state = {}, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case GET_PROJECT_ID:
    case GET_PROJECTS:
    case GET_PROJECT_QUERY:
    case GET_AGREEMENT_PROJECTS:
        return action.response;
    case POST_PROJECT:
    case PUT_PROJECT:
        return {};
    case GET_PAGINATION:
        const next = action.response.next;
        const prev = action.response.prev;
        if ((next != null && next.startsWith('/project')) ||
            (prev != null && prev.startsWith('/project')) ||
            (window.location.hash === '#/project')) {
            return action.response;
        }
        return state;
    default:
        return state;
    }
};
export default projectsReducer;
