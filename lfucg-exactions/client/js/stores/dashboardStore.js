import { compose, applyMiddleware, createStore } from 'redux';

import flashMiddleware from '../middlewares/flashMiddleware';
import logMiddleware from '../middlewares/logMiddleware';
import apiMiddleware from '../middlewares/apiMiddleware';
import dashboardReducer from '../reducers/dashboardReducer';
import debounceMiddleware from '../middlewares/debounceMiddleware';

const enhancer = compose(
    applyMiddleware(
        debounceMiddleware,
        flashMiddleware,
        logMiddleware,
        apiMiddleware,
    ),
);

const store = createStore(dashboardReducer, {}, enhancer);

export default store;

