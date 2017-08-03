import {
    GET_PROJECTS,
    GET_PROJECT_ID,
    GET_PROJECT_QUERY,
    POST_PROJECT,
    PUT_PROJECT,
} from '../constants/apiConstants';


const projectsReducer = (state = {}, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case GET_PROJECT_ID:
        return action.response;
    case GET_PROJECTS:
        return action.response;
    case GET_PROJECT_QUERY:
        return action.response;
    case POST_PROJECT:
        return {};
    case PUT_PROJECT:
        return {};
    default:
        return state;
    }
};
export default projectsReducer;
