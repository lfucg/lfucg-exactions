
import {
    FORM_INIT,
    FORM_UPDATE,
    FORM_RESET,
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
