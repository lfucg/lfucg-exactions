import {
  API_CALL,
} from '../constants/actionTypes';

import {
    ME,

    LOGIN,
    REGISTER,
    LOGOUT,

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

export function login() {
    return {
        type: API_CALL,
        endpoint: LOGIN,
        url: '/login/',
        method: 'POST',
        body: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                username,
                password,
            } = activeForm;
            return {
                username,
                password,
            };
        },
    };
}

export function register() {
    return {
        type: API_CALL,
        endpoint: REGISTER,
        url: '/register/',
        method: 'POST',
        body: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                username_1,
                password_1,
                // password_2,
                first_name,
                last_name,
                email,
            } = activeForm;
            return {
                username: username_1,
                password_1,
                // password_2,
                first_name,
                last_name,
                email,
            };
        },
    };
}

export function logout() {
    return {
        type: API_CALL,
        endpoint: LOGOUT,
        url: '/delete_token/',
        method: 'POST',
    };
}

export function getSubdivisions() {
    return {
        type: API_CALL,
        endpoint: GET_SUBDIVISIONS,
        url: '/subdivision/',
    };
}

export function postSubdivision() {
    return {
        type: API_CALL,
        endpoint: POST_SUBDIVISION,
        url: '/subdivision/',
        method: 'POST',
        body: (getState) => {
            const {
                activeForm,
                currentUser,
            } = getState();
            const {
                name,
                gross_acreage,
                number_allowed_lots,
            } = activeForm;
            const {
                id,
            } = currentUser;
            return {
                created_by: id,
                modified_by: id,
                name,
                gross_acreage,
                number_allowed_lots,
            };
        },
    };
}

export function getPlats() {
    return {
        type: API_CALL,
        endpoint: GET_PLATS,
        url: '/plat/',
    };
}

export function postPlat() {
    return {
        type: API_CALL,
        endpoint: POST_PLAT,
        url: '/plat/',
        method: 'POST',
        body: (getState) => {
            const {
                activeForm,
                currentUser,
            } = getState();
            const {
                subdivision,
                date_recorded,
                total_acreage,
                latitude,
                longitude,
                plat_type,
                expansion_area,
                unit,
                section,
                block,
                buildable_lots,
                non_buildable_lots,
                cabinet,
                slide,
                calculation_note,
                sewer_due,
                non_sewer_due,
            } = activeForm;
            const {
                id,
            } = currentUser;
            return {
                created_by: id,
                modified_by: id,
                subdivision,
                date_recorded,
                total_acreage,
                latitude,
                longitude,
                plat_type,
                expansion_area,
                unit,
                section,
                block,
                buildable_lots,
                non_buildable_lots,
                cabinet,
                slide,
                calculation_note,
                sewer_due,
                non_sewer_due,
            };
        },
    };
}
