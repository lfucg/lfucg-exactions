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

const platsReducer = (state = initialState, action) => {
    const {
        endpoint,
    } = action;
    console.log('ENDPOINT', endpoint);
    switch (endpoint) {
    case API_CALL:
        console.log('API CALL');
        return state;
    case GET_PLATS:
        console.log('GET PLATS RED');
        return action.response;
    case GET_PLAT_ID:
        return action.response;
    case GET_SUBDIVISION_PLATS:
        console.log('SUB PLAT RED 1st');
        // console.log('SUB PLAT RED', action);
        return {
            ...state,
            plats: action.response,
            loadingPlat: false,
        }
    case PUT_PLAT:
        console.log('PUT PLAT RED');
        return action.response;
    case POST_PLAT:
        console.log('POST PLAT RED');
        return {};
    case GET_PAGINATION:
        console.log('GET PAGE RED');
        return action.response;
    case SEARCH_QUERY:
        if (action.response.endpoint === '/plat') {
            return action.response;
        }
        return state;
    case GET_SUBDIVISION_ID:
        console.log('SUB ID');
        return {};
    default:
        console.log('DEFAULT');
        return state;
    }
};
export default platsReducer;
