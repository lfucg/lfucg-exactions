
import {
    FORM_INIT,
    FORM_UPDATE,
    FORM_RESET,
    CURRENT_JOB_UPDATE,
    CLEAR_API_DATA,
} from '../constants/actionTypes';


export function formInit() {
    return {
        type: FORM_INIT,
    };
}

export function formUpdate(update) {
    return {
        type: FORM_UPDATE,
        update,
    };
}

export function formReset() {
    return {
        type: FORM_RESET,
    };
}

export function formJobCurrent() {
    return {
        type: CURRENT_JOB_UPDATE,
    };
}

export function clearAPIData() {
    return {
        type: CLEAR_API_DATA,
    };
}

