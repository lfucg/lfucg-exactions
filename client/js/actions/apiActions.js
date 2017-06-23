import {
  API_CALL,
} from '../constants/actionTypes';

import {
    ME,
    LOGIN,
    REGISTER,
    LOGOUT,
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
