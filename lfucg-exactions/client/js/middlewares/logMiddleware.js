/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */

export default function logMiddleware({ getState }) {
    return next => (action) => {
        console.group && console.group(action.type);
        console.info('dispatching', action);
        const result = next(action);
        console.log('next state', getState());
        console.groupEnd && console.groupEnd(action.type);
        return result;
    };
}

