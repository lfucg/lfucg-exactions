import { contains } from 'ramda';

import {
    API_CALL_START,
} from '../constants/actionTypes';

import {
    GET_PROJECT_COSTS,
    GET_PROJECT_PROJECT_COSTS,
    GET_PROJECT_COST_ID,
    POST_PROJECT_COST,
    PUT_PROJECT_COST,
    GET_PAGINATION,
    SEARCH_QUERY,
} from '../constants/apiConstants';

const initialState = {
    currentProjectCost: null,
    loadingProjectCost: true,
    projectCosts: [],
    next: null,
    count: 0,
    prev: null,
}

const projectCostApiCalls = [GET_PROJECT_COSTS, GET_PROJECT_PROJECT_COSTS, GET_PROJECT_COST_ID, POST_PROJECT_COST, PUT_PROJECT_COST];

const projectCostsReducer = (state = initialState, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case API_CALL_START:
        if (contains(action.apiCall)(projectCostApiCalls) || contains('/estimate')(action.apiCall)) {
            return {
                ...state,
                loadingProjectCost: true,
            };
        }
        return state;
    case GET_PROJECT_COST_ID:
        return {
            ...state,
            currentProjectCost: action.response,
            loadingProjectCost: false,
            next: null,
            count: 1,
            prev: null,
        }
    case GET_PROJECT_COSTS:
    case GET_PROJECT_PROJECT_COSTS:
        return {
            ...state,
            currentProjectCost: null,
            loadingProjectCost: false,
            projectCosts: action.response,
            next: action.response.next,
            count: action.response.count,
            prev: action.response.previous,
        }
    case POST_PROJECT_COST:
    case PUT_PROJECT_COST:
        return state;
    case GET_PAGINATION:
    case SEARCH_QUERY:
        if (action.response.endpoint === '/estimate') {
            return {
                ...state,
                currentProjectCost: null,
                loadingProjectCost: false,
                projectCosts: action.response,
                next: action.response.next,
                count: action.response.count,
                prev: action.response.previous,
            }
        }
        return state;
    default:
        return state;
    }
};
export default projectCostsReducer;
