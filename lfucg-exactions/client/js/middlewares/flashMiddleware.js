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
            map((error) => {
                document.getElementById(error).classList.add('error');
                document.querySelector(`label[for='${error}']`).classList.add('label-error');
                const help_text = document.getElementById(`help-block-${error}`);
                help_text.classList.remove('hidden');
                help_text.innerHTML = `<i class="fa fa-exclamation-circle"></i> ${action.response[error]}`;
            })(Object.keys(action.response));
        }
        return next(action);
    };
}
