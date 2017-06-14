import { compose, applyMiddleware, createStore } from 'redux';

import flashMiddleware from '../middlewares/flashMiddleware';
import logMiddleware from '../middlewares/logMiddleware';
import apiMiddleware from '../middlewares/apiMiddleware';
import dashboardReducer from '../reducers/dashboardReducer';

const enhancer = compose(
    applyMiddleware(
        flashMiddleware,
        logMiddleware,
        apiMiddleware,
    ),
);

const store = createStore(dashboardReducer, {}, enhancer);

export default store;

