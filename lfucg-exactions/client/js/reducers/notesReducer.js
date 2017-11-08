import {
    GET_NOTE_CONTENT,
    GET_SECONDARY_NOTE_CONTENT,
    POST_NOTE,
} from '../constants/apiConstants';

const notesReducer = (state = {}, action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case GET_NOTE_CONTENT:
        return action.response;
    case GET_SECONDARY_NOTE_CONTENT:
        return state.concat(action.response);
    case POST_NOTE:
        return {};
    default:
        return state;
    }
};

export default notesReducer;
