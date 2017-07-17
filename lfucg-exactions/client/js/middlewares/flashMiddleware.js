import {
    flashMessageClear,
} from '../actions/flashMessageActions';

import {
    FLASH_MESSAGE_SET,
} from '../constants/actionTypes';

export default function flashMiddleware({ dispatch }) {
    return next => (action) => {
        if (action.type === FLASH_MESSAGE_SET) {
            setTimeout(() => {
                dispatch(flashMessageClear());
            }, 5000);
        }
        return next(action);
    };
}
