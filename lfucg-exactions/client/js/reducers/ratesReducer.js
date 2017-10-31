import { map, merge } from 'ramda';

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
        // return action.response;
        // const rate_ids = [];
        const new_dict = {};
        const rate_pair = map((rate_set) => {
            new_dict[rate_set.table_identifier] = rate_set;
            // console.log('REDUCER NEW DICT', new_dict);
            // return merge(new_dict, { rate_data: rate_set });
            // const table_name = rate_set.table_identifier;
            // merge({rate_set.table_identifier: rate_set.rate}, rate_set);
            // return (
                // { id: `${rate_set.category}, ${rate_set.zone}, ${rate_set.expansion_area}`, value: rate_set.rate }
            // rate_ids[`${rate_set.category}, ${rate_set.zone}, ${rate_set.expansion_area}`] = rate_set.rate;
            // );
            // rate_ids.push(rate_set);
        })(action.response);
        const arr_dict = [new_dict];
            // return new_dict;
        // console.log('REDUCER RATE PAIR', rate_pair);
        // return merge(table_identifier, action.response);
        return arr_dict;
    case POST_RATE:
    case PUT_RATE:
        return {};
    default:
        return state;
    }
};

export default ratesReducer;
