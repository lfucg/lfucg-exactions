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
    POST_UPLOAD,
} from '../constants/apiConstants';

export default function upload({ getState, dispatch }) {
    return next => (action) => {
        const {
            type,
            endpoint,
            url,
            shouldCallAPI,
            responseValidation,
            qs,
            body,
            headers,
            baseURL = BASE_URL,
            method = 'GET',
        } = action;

        if (type !== API_CALL) {
            return next(action);
        }

        if (endpoint !== POST_UPLOAD) {
            return next(action);
        }

        if (shouldCallAPI && !shouldCallAPI()) {
            return next(action);
        }
        const header = (global.Authorization && global.Authorization.length > 1) ? {
            'X-CSRFToken': global.CSRFToken,
            Authorization: `Token ${global.Authorization}`,
        } : {
            'X-CSRFToken': global.CSRFToken,
        };
        const header_set = typeof headers === 'function' ? headers(getState) : header;

        return Promise.resolve(axios({
            headers: header_set,
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

