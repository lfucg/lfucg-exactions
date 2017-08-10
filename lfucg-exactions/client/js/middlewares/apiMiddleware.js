import axios from 'axios';
import Promise from 'bluebird';

import {
  API_CALL,
  API_CALL_SUCCESS,
  API_CALL_ERROR,
  API_CALL_VALIDATION_ERROR,
} from '../constants/actionTypes';
import {
    BASE_URL,
    LOGIN,
    ME,
} from '../constants/apiConstants';

export default function api({ getState, dispatch }) {
    return next => (action) => {
        const {
            type,
            endpoint,
            url,
            shouldCallAPI,
            responseValidation,
            qs,
            body,
            baseURL = BASE_URL,
            method = 'GET',
        } = action;

        if (type !== API_CALL) {
            return next(action);
        }

        if (shouldCallAPI && !shouldCallAPI()) {
            return next(action);
        }
        const header = (global.Authorization.length > 1) ? {
            'X-CSRFToken': global.CSRFToken,
            Authorization: `Token ${global.Authorization}`,
        } : {
            'X-CSRFToken': global.CSRFToken,
        };
        console.log('GLOBAL TOKEN', global.auth_token);
        return Promise.resolve(axios({
            headers: header,
            url: baseURL + (typeof url === 'function' ? url(getState) : url),
            params: typeof qs === 'function' ? qs(getState) : qs,
            data: typeof body === 'function' ? body(getState) : body,
            method,
        }))
        .then((response) => {
            const error = responseValidation ?
            responseValidation(response.data, { getState, dispatch }) :
            null;
            if (endpoint === LOGIN) {
                global.Authorization = response.data.key;
            }
            if (endpoint === ME) {
                global.Authorization = response.data.token;
            }
            if (error) {
                dispatch({
                    type: API_CALL_VALIDATION_ERROR,
                    error,
                });
                return Promise.reject(error);
            }
            return dispatch({
                type: API_CALL_SUCCESS,
                response: response.data,
                endpoint,
            });
        })
        .catch((error) => {
            console.log(error);  // eslint-disable-line no-console
            return dispatch({
                type: API_CALL_ERROR,
                error,
            });
        });
    };
}

