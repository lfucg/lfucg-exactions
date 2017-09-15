import Promise from 'bluebird';
import axios from 'axios';

import {
  ACCELA_API_CALL,
  ACCELA_API_CALL_SUCCESS,
  ACCELA_API_CALL_ERROR,
  ACCELA_API_CALL_VALIDATION_ERROR,
} from '../constants/accelaConstants';

export default function accelaApi({ getState, dispatch }) {
    return next => (action) => {
        const {
            type,
            endpoint,
            url,
            responseValidation,
            qs,
            body,
            method = 'GET',
            ACCELA_APP_ID,
            ACCELA_ENVIRONMENT,
            ACCELA_AGENCY,
        } = action;

        if (type !== ACCELA_API_CALL) {
            return next(action);
        }

        const app_id = ACCELA_APP_ID;
        const environment = ACCELA_ENVIRONMENT;
        const agency = ACCELA_AGENCY;

        const header = {
            'x-accela-appid': app_id,
            'x-accela-environment': environment,
            'x-accela-agency': agency,
        };

        return Promise.resolve(axios({
            headers: header,
            url: typeof url === 'function' ? url(getState) : url,
            params: typeof qs === 'function' ? qs(getState) : qs,
            data: typeof body === 'function' ? body(getState) : body,
            method,
        }))
        .then((response) => {
            console.log('INSIDE RESPONSE');
            console.log('ACCELA MIDDLEWARE RESPONSE', response);

            const error = responseValidation ?
            responseValidation(response.data, { getState, dispatch }) :
            null;
            if (error) {
                dispatch({
                    type: ACCELA_API_CALL_VALIDATION_ERROR,
                    error,
                });
                return Promise.reject(error);
            }

            if (response.data.results) {
                return dispatch({
                    type: ACCELA_API_CALL_SUCCESS,
                    response: response.data,
                    endpoint,
                });
            }

            return dispatch({
                type: ACCELA_API_CALL_SUCCESS,
                response: response.data,
                endpoint,
            });
        })
        .catch((error) => {
            console.log(error);  // eslint-disable-line no-console
            return dispatch({
                type: ACCELA_API_CALL_ERROR,
                error,
            });
        });
    };
}

