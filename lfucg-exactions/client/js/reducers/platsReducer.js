import { map, mapObjIndexed } from 'ramda';

import {
    API_CALL,
} from '../constants/actionTypes';

import {
    GET_PLATS,
    GET_PLAT_ID,
    GET_SUBDIVISION_PLATS,
    POST_PLAT,
    PUT_PLAT,
    GET_PAGINATION,
    SEARCH_QUERY,
    GET_SUBDIVISION_ID,
} from '../constants/apiConstants';

const initialState = {
    currentPlat: null,
    loadingPlat: true,
    plats: [],
} 

const convertCurrency = (plats) => {
    const platCurrencyFields = ['sewer_due', 'non_sewer_due', 'current_sewer_due', 'current_non_sewer_due'];
    const newPlatList = map((plat) => {

        mapObjIndexed((value) => {
            const field_value = parseFloat(plat[value]);
            plat[value] = field_value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        })(platCurrencyFields);

        return plat;
    })(plats)

    return newPlatList;
}

const platsReducer = (state = initialState, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case API_CALL:
        return state;
    case GET_PLAT_ID:
        return {
            ...state,
            currentPlat: action.response,
            loadingPlat: false,
        };
    case GET_PLATS:
    case GET_SUBDIVISION_PLATS:
        return {
            ...state,
            plats: convertCurrency(action.response),
            loadingPlat: false,
        }
    case PUT_PLAT:
        return action.response;
    case POST_PLAT:
        return {};
    case GET_PAGINATION:
    case SEARCH_QUERY:
        if (action.response.endpoint === '/plat') {
            return {
                ...state,
                plats: action.response,
                loadingPlat: false,
            }
        }
        return state;
    case GET_SUBDIVISION_ID:
        return {};
    default:
        return state;
    }
};
export default platsReducer;
