import Promise from 'bluebird';
import axios from 'axios';

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
    POST_UPLOAD,
} from '../constants/apiConstants';

export default function api({ getState, dispatch }) {
    return next => (action) => {
        const {
            type,
            endpoint,
            headers,
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

        if (endpoint === POST_UPLOAD) {
            return next(action);
        }

        if (shouldCallAPI && !shouldCallAPI()) {
            return next(action);
        }
        let stored_token;
        try {
            stored_token = localStorage.getItem('Token');
        } catch (e) {
            const index_token = document.cookie.indexOf('Token=');
            if (index_token) {
                const semicolon = index_token + 5 + document.cookie.substring(index_token).indexOf(';');
                stored_token = document.cookie.substring(index_token, semicolon);
            } else {
                stored_token = null;
            }
        }

        const authorization = global.Authorization ? global.Authorization : stored_token;
        const header = (authorization !== null) ? {
            'X-CSRFToken': global.CSRFToken,
            Authorization: `Token ${authorization}`,
        } : {
            'X-CSRFToken': global.CSRFToken,
        };

        return Promise.resolve(axios({
            headers: typeof headers === 'function' ? headers(getState) : header,
            url: baseURL + (typeof url === 'function' ? url(getState) : url),
            params: typeof qs === 'function' ? qs(getState) : qs,
            data: typeof body === 'function' ? body(getState) : body,
            method,
        }))
        .then((response) => {
            const error = responseValidation ?
            responseValidation(response.data, { getState, dispatch }) :
            null;
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

