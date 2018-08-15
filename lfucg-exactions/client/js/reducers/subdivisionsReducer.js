import {
    API_CALL,
} from '../constants/actionTypes';

import {
    GET_SUBDIVISIONS,
    GET_SUBDIVISION_ID,
    POST_SUBDIVISION,
    PUT_SUBDIVISION,
    GET_PAGINATION,
    SEARCH_QUERY,
} from '../constants/apiConstants';

const initialState = {
    currentSubdivision: null,
    loadingSubdivision: true,
    subdivisions: [],
}


const subdivisionsReducer = (state = initialState, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case API_CALL:
        return {
            ...state,
            loadingSubdivision: true,
            currentSubdivision: null,
        }
    case GET_SUBDIVISION_ID:
        return {
            ...state,
            currentSubdivision: action.response,
            loadingSubdivision: false,
        }
    case GET_SUBDIVISIONS:
        return action.response;
    case POST_SUBDIVISION:
    case PUT_SUBDIVISION:
        return {};
    case GET_PAGINATION:
        if (action.response.endpoint.indexOf('sub') === -1) {
            return state;
        } else {
            return {
                ...state,
                subdivisions: action.response,
                loadingSubdivision: false,
            }
        }
    case SEARCH_QUERY:
        if (action.response.endpoint === '/subdivision') {
            return {
                ...state,
                subdivisions: action.response,
                loadingSubdivision: false,
            }
        }
        return state;
    default:
        return state;
    }
};
export default subdivisionsReducer;
