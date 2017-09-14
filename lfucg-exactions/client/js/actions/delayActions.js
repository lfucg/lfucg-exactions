import { DELAY_API_CALL } from '../constants/actionTypes';

export function delayApi() {
    return {
        type: DELAY_API_CALL,
        meta: {
            debounce: 5000,
        },
    };
}
