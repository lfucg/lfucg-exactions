import {
    clone,
    indexOf,
    map,
    merge,
    split,
} from 'ramda';

import {
    FORM_INIT,
    FORM_UPDATE,
    FORM_RESET,
    API_CALL_SUCCESS,
    API_CALL_START,
} from '../constants/actionTypes';

import {
    CLEAR_SEARCH,
} from '../constants/searchConstants';

const initialState = {
    currentPage: null,
    loading: false,
}

export default function activeFormReducer(state = initialState, action) {
    switch (action.type) {
        case FORM_INIT:
            return {};
        case FORM_RESET:
            map((key_name) => {
                if (key_name.indexOf('filter') !== -1) {
                    delete state[key_name];
                }
            })(Object.keys(state));
            return merge(state, action.update);
        case API_CALL_SUCCESS:
            if (action.endpoint === 'GET_PAGINATION' || (action.endpoint.indexOf('QUERY') !== -1)) {
                let location = window.location.hash.slice(1);

                if (location === '/credit-transfer') {
                    location = '/ledger';
                }

                if (location === '/project-cost') {
                    location = '/estimate';
                }

                if (location === action.response.endpoint) {
                    const currentPage = `${location}/`;
                    return merge(state, { next: action.response.next, prev: action.response.prev, count: action.response.count, currentPage });
                }
            }
            return {
                ...state,
                loading: false,
            };
        case FORM_UPDATE:
            return merge(state, action.update);
        case API_CALL_START:
            if (indexOf('/', action.apiCall) !== -1) {
                return {
                    ...state,
                    loading: true,
                    currentPage: `/${split('/', action.apiCall)[1]}`,
                };
            }
            return {
                ...state,
                loading: true,
            };
        case CLEAR_SEARCH:
            const cloneState = clone(state);
            return {
                ...initialState,
                currentPage: cloneState.currentPage,
            };
        default:
            return state;
    }
}
