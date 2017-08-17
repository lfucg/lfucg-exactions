import { compose, applyMiddleware, createStore } from 'redux';

import flashMiddleware from '../middlewares/flashMiddleware';
import logMiddleware from '../middlewares/logMiddleware';
import apiMiddleware from '../middlewares/apiMiddleware';
import uploadMiddleware from '../middlewares/uploadMiddleware';
import dashboardReducer from '../reducers/dashboardReducer';

const enhancer = compose(
    applyMiddleware(
        flashMiddleware,
        logMiddleware,
        apiMiddleware,
        uploadMiddleware,
    ),
);

const store = createStore(dashboardReducer, {}, enhancer);

export default store;

