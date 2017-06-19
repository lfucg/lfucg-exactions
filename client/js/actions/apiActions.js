import {
  API_CALL,
} from '../constants/actionTypes';

import {
    ME,
    LOGIN,
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
