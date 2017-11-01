import { map } from 'ramda';

import {
    GET_RATES,
    POST_RATE,
    PUT_RATE,
} from '../constants/apiConstants';

import {
    API_CALL_SUCCESS,
    CLEAR_RATES,
} from '../constants/actionTypes';

function ratesEndpoints(state = {}, action) {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case GET_RATES:
        const new_dict = {};
        map((rate_set) => {
            new_dict[rate_set.table_identifier] = rate_set;
        })(action.response);
        const arr_dict = [new_dict];
        return arr_dict;
    case POST_RATE:
    case PUT_RATE:
        return state;
    default:
        return state;
    }
}

const ratesReducer = (state = {}, action) => {
    switch (action.type) {
    case CLEAR_RATES:
        return {};
    case API_CALL_SUCCESS:
        return ratesEndpoints(state, action);
    default:
        return state;
    }
};

export default ratesReducer;
