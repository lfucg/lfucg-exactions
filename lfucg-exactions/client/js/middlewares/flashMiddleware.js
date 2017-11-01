import { map } from 'ramda';

import {
    flashMessageClear,
} from '../actions/flashMessageActions';

import {
    FLASH_MESSAGE_SET,
    ERROR_MESSAGE_SET,
} from '../constants/actionTypes';

export default function flashMiddleware({ dispatch }) {
    return next => (action) => {
        if (action.type === FLASH_MESSAGE_SET) {
            setTimeout(() => {
                dispatch(flashMessageClear());
            }, 5000);
        }
        if (action.type === ERROR_MESSAGE_SET) {
            const element = document.getElementById(Object.keys(action.response)[0]);
            element.classList.add('error');
            element.htmlFor.classList.add('error');
            // document.getElementsByTagName('help', Object.keys(action.response)[0]).classList.remove('hidden');
        }
        return next(action);
    };
}
