import { FLASH_MESSAGE_SET, FLASH_MESSAGE_CLEAR, ERROR_MESSAGE_SET } from '../constants/actionTypes';

const flashMessageReducer = (state = { message: null }, action) => {
    switch (action.type) {
    case FLASH_MESSAGE_SET:
        return {
            message: action.message,
            messageType: action.messageType,
        };
    case FLASH_MESSAGE_CLEAR:
        return {};
    case ERROR_MESSAGE_SET:
        return action.response;
    default:
        return state;
    }
};

export default flashMessageReducer;
