import Promise from 'bluebird';
import { has } from 'ramda';

import { PROCESS_QUEUE, PROCESS_QUEUE_UPDATE, PROCESS_QUEUE_ERROR } from '../constants/actionTypes';

export default function processQueue({ dispatch }) {
    return next => (action) => {
        if (action.type !== PROCESS_QUEUE) {
            return next(action);
        }

        if (!action.actions) {
            return Promise.reject(new Error(`${PROCESS_QUEUE} actions must have an actions property`));
        }
        next(action);
        return Promise.mapSeries(action.actions,
            (queueAction) => {
                return Promise.resolve(dispatch(queueAction))
                .then((a) => {
                    if (has('error', a)) {
                        dispatch({
                            type: PROCESS_QUEUE_ERROR,
                            error: a.error,
                        });
                        return Promise.reject(a.error);
                    }
                    dispatch({ type: PROCESS_QUEUE_UPDATE });
                    return a;
                });
            })
        .mapSeries((stepPromises) => {
            return Promise.resolve(stepPromises);
        })
        .then((resolvedSteps) => {
            if (action.final) {
                dispatch(action.final);
            }
            return resolvedSteps;
        })
        .catch((ex) => {
            console.log(ex);
            return { type: PROCESS_QUEUE_ERROR };
        });
    };
}
