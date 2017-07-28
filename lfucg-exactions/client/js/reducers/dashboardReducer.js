import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import currentUserReducer from './currentUserReducer';
import tokenReducer from './tokenReducer';

import activeFormReducer from './activeFormReducer';

import subdivisionsReducer from './subdivisionsReducer';
import platsReducer from './platsReducer';
import lotsReducer from './lotsReducer';

import notesReducer from './notesReducer';

const dashboardReducer = combineReducers({
    routing: routerReducer,

    currentUser: currentUserReducer,
    token: tokenReducer,

    activeForm: activeFormReducer,

    subdivisions: subdivisionsReducer,
    plats: platsReducer,
    lots: lotsReducer,

    notes: notesReducer,
});

export default dashboardReducer;

