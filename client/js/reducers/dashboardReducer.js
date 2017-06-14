import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import currentUserReducer from './currentUserReducer';

const dashboardReducer = combineReducers({
    //currentUser: currentUserReducer,
    routing: routerReducer,
});

export default dashboardReducer;

