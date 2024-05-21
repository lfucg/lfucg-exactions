import { FLASH_MESSAGE_SET, FLASH_MESSAGE_CLEAR, ERROR_MESSAGE_SET } from '../constants/actionTypes';

export function flashMessageSet(message, messageType) {
    return {
        type: FLASH_MESSAGE_SET,
        message,
        messageType,
    };
}

export function flashMessageClear() {
    return {
        type: FLASH_MESSAGE_CLEAR,
        message: null,
    };
}

export function errorMessageSet(error_obj = {}) {
    return {
        type: ERROR_MESSAGE_SET,
        response: error_obj,
    };
}
