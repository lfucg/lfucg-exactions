import { contains } from 'ramda';

import { API_CALL_START } from '../constants/actionTypes';
import { SET_LOADING_FALSE } from '../constants/stateConstants';

import {
    GET_SUBDIVISIONS,
    GET_SUBDIVISIONS_QUICK,
    GET_SUBDIVISION_ID,
    POST_SUBDIVISION,
    PUT_SUBDIVISION,
    GET_PAGINATION,
    SEARCH_QUERY,
    SET_SUBDIVISION_ERROR,
} from '../constants/apiConstants';

const initialState = {
    currentSubdivision: null,
    loadingSubdivision: true,
    subdivisions: [],
    next: null,
    count: 0,
    prev: null,
    errorSubdivision: null,
}

const subdivisionApiCalls = [GET_SUBDIVISIONS, GET_SUBDIVISIONS_QUICK, GET_SUBDIVISION_ID, POST_SUBDIVISION, PUT_SUBDIVISION];

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
                errorSubdivision: null,
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
            errorSubdivision: null,
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
        return {
            ...state,
            loadingSubdivision: false,
        };
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
            return {
                ...state,
                loadingSubdivision: false,
            };
        }
    case SET_LOADING_FALSE:
        if (action.model === 'subdivision') {
            return {
                ...state,
                loadingSubdivision: false,
            }
        }
        return state;
    case SET_SUBDIVISION_ERROR:
        return {
            ...state,
            errorSubdivision: action.body().subdivisionError,
            loadingSubdivision: false,
        };
    default:
        return state;
    }
};
export default subdivisionsReducer;
