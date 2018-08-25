import { contains } from 'ramda';

import {
    API_CALL_START,
} from '../constants/actionTypes';

import {
    GET_SUBDIVISIONS,
    GET_SUBDIVISIONS_QUICK,
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
    next: null,
    count: 0,
    prev: null,
}

const subdivisionApiCalls = [GET_SUBDIVISIONS, GET_SUBDIVISION_ID, POST_SUBDIVISION, PUT_SUBDIVISION];

const subdivisionsReducer = (state = initialState, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case API_CALL_START:
        if (contains(action.apiCall)(subdivisionApiCalls) || contains('/subdivision/')(action.apiCall)) {
            return {
                ...state,
                loadingSubdivision: true,
            };
        }
        return state;
    case GET_SUBDIVISION_ID:
        return {
            ...state,
            currentSubdivision: action.response,
            loadingSubdivision: false,
            next: null,
            count: 1,
            prev: null,
        }
    case GET_SUBDIVISIONS:
        return {
            ...state,
            currentSubdivision: null,
            subdivisions: action.response,
            loadingSubdivision: false,
            next: action.response.next,
            count: action.response.count,
            prev: action.response.previous,
        }
    case GET_SUBDIVISIONS_QUICK:
        return {
            ...state,
            currentSubdivision: null,
            loadingSubdivision: false,
            next: null,
            count: 0,
            subdivisions: action.response,
            prev: null,
        };
    case POST_SUBDIVISION:
    case PUT_SUBDIVISION:
        return state;
    case GET_PAGINATION:
    case SEARCH_QUERY:
        if (action.response.endpoint === '/subdivision') {
            return {
                ...state,
                currentSubdivision: null,
                subdivisions: action.response,
                loadingSubdivision: false,
                next: action.response.next,
                count: action.response.count,
                prev: action.response.previous,
            }
        } else {
            return state;
        }
    default:
        return state;
    }
};
export default subdivisionsReducer;
