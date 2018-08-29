import { contains } from 'ramda';

import { API_CALL_START } from '../constants/actionTypes';
import { SET_LOADING_FALSE } from '../constants/stateConstants';

import {
    GET_PROJECTS,
    GET_PROJECTS_QUICK,
    GET_PROJECT_ID,
    GET_AGREEMENT_PROJECTS,
    POST_PROJECT,
    PUT_PROJECT,
    GET_PAGINATION,
    SEARCH_QUERY,
} from '../constants/apiConstants';

const initialState = {
    currentProject: null,
    loadingProject: true,
    projects: [],
    next: null,
    count: 0,
    prev: null,
}

const projectApiCalls = [GET_PROJECTS, GET_PROJECTS_QUICK, GET_PROJECT_ID, GET_AGREEMENT_PROJECTS, POST_PROJECT, PUT_PROJECT];

const projectsReducer = (state = initialState, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case API_CALL_START:
        if (contains(action.apiCall)(projectApiCalls) || contains('/project')(action.apiCall)) {
            return {
                ...state,
                loadingProject: true,
            };
        }
        return state;
    case GET_PROJECT_ID:
        return {
            ...state,
            currentProject: action.response,
            loadingProject: false,
            next: null,
            count: 1,
            prev: null,
        }
    case GET_PROJECTS:
    case GET_AGREEMENT_PROJECTS:
        return {
            ...state,
            currentProject: null,
            projects: action.response,
            loadingProject: false,
            next: action.response.next,
            count: action.response.count,
            prev: action.response.previous,
        }
    case GET_PROJECTS_QUICK:
        return {
            ...state,
            currentProject: null,
            loadingProject: false,
            next: null,
            count: 0,
            projects: action.response,
            prev: null,
        };
    case POST_PROJECT:
    case PUT_PROJECT:
        return state;
    case GET_PAGINATION:
    case SEARCH_QUERY:
        if (action.response.endpoint === '/project') {
            return {
                ...state,
                currentProject: null,
                projects: action.response,
                loadingProject: false,
                next: action.response.next,
                count: action.response.count,
                prev: action.response.previous,
            }
        }
        return state;
    case SET_LOADING_FALSE:
        if (action.model === 'project') {
            return {
                ...state,
                loadingProject: false,
            }
        }
        return state;
    default:
        return state;
    }
};
export default projectsReducer;
