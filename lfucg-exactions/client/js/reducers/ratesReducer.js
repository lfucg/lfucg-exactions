import { map } from 'ramda';

import {
    GET_RATES,
    POST_RATE,
    PUT_RATE,
} from '../constants/apiConstants';

const ratesReducer = (state = {}, action) => {
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
};

export default ratesReducer;
