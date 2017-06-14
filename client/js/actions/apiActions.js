import {
  API_CALL,
} from '../constants/actionTypes';

import {
    ME,  

} from '../constants/apiConstants';


export function getMe() {
    return {
        type: API_CALL,
        endpoint: ME,
        url: '/me',
    };
}
