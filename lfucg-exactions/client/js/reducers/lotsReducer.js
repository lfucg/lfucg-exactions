import { contains, map, mapObjIndexed } from 'ramda';

import { API_CALL_START } from '../constants/actionTypes';
import { SET_LOADING_FALSE } from '../constants/stateConstants';

import {
    GET_LOTS,
    GET_LOTS_QUICK,
    GET_LOTS_EXACTIONS,
    GET_LOT_ID,
    GET_ACCOUNT_LOTS,
    GET_SUBDIVISION_LOTS,
    GET_PLAT_LOTS,
    POST_LOT,
    PUT_LOT,
    PUT_PERMIT_ID_ON_LOT,
    GET_PAGINATION,
    SEARCH_QUERY,
} from '../constants/apiConstants';

const initialState = {
    currentLot: null,
    loadingLot: true,
    lots: [],
    next: null,
    count: 0,
    prev: null,
} 

const lotApiCalls = [GET_LOTS, GET_LOTS_QUICK, GET_LOTS_EXACTIONS, GET_LOT_ID, GET_ACCOUNT_LOTS, GET_SUBDIVISION_LOTS, GET_PLAT_LOTS, POST_LOT, PUT_LOT, PUT_PERMIT_ID_ON_LOT];

const convertCurrency = (lots) => {
    let newLotList = [];
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
        'sewer_exactions',
        'non_sewer_exactions',
        'total_exactions',
    ];

    if (!!lots && !lots.length) {
        newLotList = lots;
        mapObjIndexed((value) => {
            const field_value = parseFloat(lots[value]);
            if ((value === 'sewer_exactions' || value === 'non_sewer_exactions' || value === 'total_exactions') && !!lots['lot_exactions']) {
                lots['lot_exactions'][value] = parseFloat(lots['lot_exactions'][value]).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
            } else {
                lots[value] = field_value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
            }
        })(lotCurrencyFields);
    } else {
        newLotList = map((lot) => {
            
            mapObjIndexed((value) => {
                const field_value = parseFloat(lot[value]);
                if ((value === 'sewer_exactions' || value === 'non_sewer_exactions' || value === 'total_exactions') && !!lots['lot_exactions']) {
                    lot['lot_exactions'][value] = parseFloat(lot['lot_exactions'][value]).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                } else {
                    lot[value] = field_value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                }
            })(lotCurrencyFields);
            
            return lot;
        })(lots)
    }

    return newLotList;
}

const lotsReducer = (state = initialState, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case API_CALL_START:
        if (contains(action.apiCall)(lotApiCalls) || contains('/lot')(action.apiCall)) {
            return {
                ...state,
                loadingLot: true,
            };
        }
        return state;
    case GET_LOT_ID:
        return {
            ...state,
            currentLot: convertCurrency(action.response),
            loadingLot: false,
            next: null,
            count: 0,
            prev: null,
        };
    case GET_LOTS:
    case GET_ACCOUNT_LOTS:
    case GET_SUBDIVISION_LOTS:
    case GET_PLAT_LOTS:
        return {
            ...state,
            currentLot: null,
            lots: convertCurrency(action.response),
            loadingLot: false,
            next: action.response.next,
            count: action.response.count,
            prev: action.response.previous,
        }
    case GET_LOTS_QUICK:
    case GET_LOTS_EXACTIONS:
        return {
            ...state,
            currentLot: null,
            loadingLot: false,
            next: null,
            count: 0,
            lots: action.response,
            prev: null,
        };
    case POST_LOT:
    case PUT_LOT:
        return {
            ...state,
            loadingLot: false,
        };
    case PUT_PERMIT_ID_ON_LOT:
        return {
            currentLot: action.response,
            loadingLot: false,
        };
    case SEARCH_QUERY:
    case GET_PAGINATION:
        if (
            action.response.endpoint === '/lot' ||
            action.response.endpoint === '/lotQuick'
        ) {
            return {
                ...state,
                currentLot: null,
                lots: convertCurrency(action.response),
                loadingLot: false,
                next: action.response.next,
                count: action.response.count,
                prev: action.response.previous,
            }
        }
        return {
            ...state,
            loadingLot: false,
        };
    case SET_LOADING_FALSE:
        if (action.model === 'lot') {
            return {
                ...state,
                loadingLot: false,
            }
        }
        return state;
    default:
        return state;
    }
};
export default lotsReducer;
