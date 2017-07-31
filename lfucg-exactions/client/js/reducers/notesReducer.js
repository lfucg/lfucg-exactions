import {
    GET_NOTE_CONTENT,
    POST_NOTE,
} from '../constants/apiConstants';

const notesReducer = (state = {}, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case GET_NOTE_CONTENT:
        return action.response;
    case POST_NOTE:
        return {};
    default:
        return state;
    }
};

export default notesReducer;
