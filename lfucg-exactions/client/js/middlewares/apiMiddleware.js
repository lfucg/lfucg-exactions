import Promise from 'bluebird';
import axios from 'axios';
import { map } from 'ramda';

import {
  API_CALL,
  API_CALL_SUCCESS,
  API_CALL_ERROR,
  API_CALL_VALIDATION_ERROR,
  API_CALL_START,
} from '../constants/actionTypes';
import {
    BASE_URL, PASSWORD, LOGOUT,
} from '../constants/apiConstants';
import { setLoadingFalse } from '../constants/stateConstants';

import {
    errorMessageSet,
} from '../actions/flashMessageActions';

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

        if (endpoint === PASSWORD) {
            localStorage.removeItem('Token');
        }
        if (endpoint === LOGOUT) {
            delete global.Authorization;
            localStorage.removeItem('Token');
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

        dispatch({
            type: API_CALL_START,
            endpoint: API_CALL_START,
            apiCall: (endpoint === 'GET_PAGINATION' || endpoint === 'SEARCH_QUERY') ? url(getState) : endpoint,
        });

        const authorization = global.Authorization ? global.Authorization : stored_token;
        const header = (authorization !== null) ? {
            'X-CSRFToken': global.CSRFToken,
            Authorization: `Token ${authorization}`,
        } : {
            'X-CSRFToken': global.CSRFToken,
        };

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
            if (error) {
                dispatch({
                    type: API_CALL_VALIDATION_ERROR,
                    error,
                });
                return Promise.reject(error);
            }

            if (response.data.results) {
                const api_index = response.request.responseURL.indexOf('api') + 3;
                const qmark_index = response.request.responseURL.indexOf('?') - 1;
                const api_endpoint = response.request.responseURL.slice(api_index, qmark_index);

                const adjustedResponse = response.data.results;
                adjustedResponse.next = response.data.next ? response.data.next.slice(response.data.next.indexOf('api') + 3, response.data.next.length) : null;
                adjustedResponse.previous = response.data.previous ? response.data.previous.slice(response.data.previous.indexOf('api') + 3, response.data.previous.length) : null;
                adjustedResponse.count = response.data.count;
                adjustedResponse.endpoint = api_endpoint;

                return dispatch({
                    type: API_CALL_SUCCESS,
                    response: adjustedResponse,
                    endpoint,
                });
            }

            return dispatch({
                type: API_CALL_SUCCESS,
                response: response.data,
                endpoint,
            });
        })
        .catch((error) => {
            console.log('API Middleware Error: ', error);  // eslint-disable-line no-console
            if (error.response.status !== 500) {
                const error_obj = error.response.data;
                const error_message = {};
                map((one_error) => {
                    error_message[one_error] = error_obj[one_error][0];
                })(Object.keys(error_obj));

                dispatch(errorMessageSet(error_message));
            }
            return dispatch({
                type: API_CALL_ERROR,
                error,
            });
        });
    };
}

