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
                if (document.getElementsByClassName('error').length > 0) {
                    let errorElements = document.getElementsByClassName('error');
                    while (errorElements.length) {
                        errorElements[0].classList.remove('error');
                    }

                    errorElements = document.getElementsByClassName('label-error');
                    while (errorElements.length) {
                        errorElements[0].classList.remove('label-error');
                    }

                    errorElements = document.querySelectorAll('.help-block:not(.hidden)');
                    map((el) => {
                        el.classList.add('hidden');
                    })(errorElements);
                }

                if (error !== 'non_field_errors') {
                    document.getElementById(error).classList.add('error');
                    document.querySelector(`label[for='${error}']`).classList.add('label-error');
                    const help_text = document.getElementById(`help-block-${error}`);
                    help_text.classList.remove('hidden');
                    help_text.setAttribute('role', 'alert');
                    help_text.innerHTML = `<i class="fa fa-exclamation-circle"></i> ${action.response[error]}`;
                }
            })(Object.keys(action.response));
        }
        return next(action);
    };
}
