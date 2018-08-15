import { map, mapObjIndexed } from 'ramda';

import {
    GET_LOTS,
    GET_LOT_ID,
    SEARCH_QUERY,
    GET_SUBDIVISION_LOTS,
    GET_PLAT_LOTS,
    POST_LOT,
    PUT_LOT,
    GET_PAGINATION,
    PUT_PERMIT_ID_ON_LOT,
} from '../constants/apiConstants';

const initialState = {
    currentLot: null,
    loadingLot: true,
    lots: [],
} 

const convertCurrency = (lots) => {
    const lotCurrencyFields = [
        'current_dues_roads_dev',
        'current_dues_roads_own',
        'current_dues_sewer_trans_dev',
        'current_dues_sewer_trans_own',
        'current_dues_sewer_cap_dev',
        'current_dues_sewer_cap_own',
        'current_dues_parks_dev',
        'current_dues_parks_own',
        'current_dues_storm_dev',
        'current_dues_storm_own',
        'current_dues_open_space_dev',
        'current_dues_open_space_own',
        // 'lot_exactions'['sewer_exactions'],
        // 'lot_exactions'['non_sewer_exactions'],
        // 'lot_exactions'['total_exactions'],
    ];
    const newLotList = map((lot) => {

        mapObjIndexed((value) => {
            const field_value = parseFloat(lot[value]);
            // console.log(' VALUE', value);
            // console.log('FIELD VALUE', field_value);

            lot[value] = field_value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        })(lotCurrencyFields);

        return lot;
    })(lots)
    // console.log('NEW LOTS', newLotList);

    return newLotList;
}

const lotsReducer = (state = initialState, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case GET_LOT_ID:
        return {
            ...state,
            currentLot: action.response,
            loadingLot: false,
        };
    case GET_LOTS:
    case GET_SUBDIVISION_LOTS:
    case GET_PLAT_LOTS:
        return {
            ...state,
            lots: convertCurrency(action.response),
            loadingLot: false,
        }
    case POST_LOT:
    case PUT_LOT:
        return action.response;
    case PUT_PERMIT_ID_ON_LOT:
        return action.response;
    case SEARCH_QUERY:
    case GET_PAGINATION:
        if (action.response.endpoint === '/lot') {
            return {
                ...state,
                lots: action.response,
                loadingLot: false,
            }
        }
        return state;
    default:
        return state;
    }
};
export default lotsReducer;
