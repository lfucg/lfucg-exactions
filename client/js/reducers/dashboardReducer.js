import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import currentUserReducer from './currentUserReducer';
import tokenReducer from './tokenReducer';

const dashboardReducer = combineReducers({
    //currentUser: currentUserReducer,
    token: tokenReducer,
    routing: routerReducer,
});

export default dashboardReducer;

