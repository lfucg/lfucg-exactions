import {
    ACCELA_API_CALL,
    GET_ACCELA,
    GET_ACCELA_ID,
    PUT_ACCELA_ID,
} from '../constants/accelaConstants';

export function getAccela() {
    return {
        type: ACCELA_API_CALL,
        endpoint: GET_ACCELA,
        url: 'https://apis.accela.com/v4/records?limit=25',
    };
}

export function getAccelaID(selectedAccela) {
    return {
        type: ACCELA_API_CALL,
        endpoint: GET_ACCELA_ID,
        url: `https://apis.accela.com/v4/records/${selectedAccela}`,
    };
}

export function putAccela(selectedAccela) {
    return {
        type: ACCELA_API_CALL,
        endpoint: PUT_ACCELA_ID,
        url: `https://apis.accela.com/v4/records/${selectedAccela}`,
        method: 'PUT',
        body: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                lot_exaction_payment,
            } = activeForm;
            return {
                lot_exaction_payment,
            };
        },
    };
}
