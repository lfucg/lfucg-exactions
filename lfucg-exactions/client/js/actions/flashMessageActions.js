import { FLASH_MESSAGE_SET, FLASH_MESSAGE_CLEAR } from '../constants/actionTypes';

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
        message: null,        },
    };
}
