import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import currentUserReducer from './currentUserReducer';

import subdivisionsReducer from './subdivisionsReducer';
import platsReducer from './platsReducer';

const dashboardReducer = combineReducers({
    routing: routerReducer,

    currentUser: currentUserReducer,

    subdivisions: subdivisionsReducer,
    plats: platsReducer,
});

export default dashboardReducer;

