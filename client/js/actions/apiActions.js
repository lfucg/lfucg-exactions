import {
  API_CALL,
} from '../constants/actionTypes';

import {
    ME,

    GET_SUBDIVISIONS,
    GET_SUBDIVISION_ID,
    POST_SUBDIVISION,
    PUT_SUBDIVISION,

    GET_PLATS,
    GET_PLAT_ID,
    POST_PLAT,
    PUT_PLAT,
} from '../constants/apiConstants';


export function getMe() {
    return {
        type: API_CALL,
        endpoint: ME,
        url: '/me',
    };
}

export function getSubdivisions() {
    return {
        type: API_CALL,
        endpoint: GET_SUBDIVISIONS,
        url: '/subdivision/',
    };
}
