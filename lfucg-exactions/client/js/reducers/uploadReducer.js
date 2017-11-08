import {
    GET_UPLOAD_CONTENT,
    POST_UPLOAD,
} from '../constants/apiConstants';

const uploadReducer = (state = [], action) => {
    const {
        endpoint,
    } = action;
    switch (endpoint) {
    case GET_UPLOAD_CONTENT:
        return action.response;
    case POST_UPLOAD:
        return {};
    default:
        return state;
    }
};

export default uploadReducer;
