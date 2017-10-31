import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import currentUserReducer from './currentUserReducer';
import tokenReducer from './tokenReducer';

import activeFormReducer from './activeFormReducer';
import flashMessageReducer from './flashMessageReducer';

import subdivisionsReducer from './subdivisionsReducer';
import platsReducer from './platsReducer';
import lotsReducer from './lotsReducer';

import accountReducer from './accountReducer';
import agreementsReducer from './agreementsReducer';
import paymentsReducer from './paymentsReducer';
import projectsReducer from './projectsReducer';
import projectCostsReducer from './projectCostsReducer';
import accountLedgersReducer from './accountLedgersReducer';

import notesReducer from './notesReducer';
import ratesReducer from './ratesReducer';
import uploadReducer from './uploadReducer';

const dashboardReducer = combineReducers({
    routing: routerReducer,

    currentUser: currentUserReducer,
    token: tokenReducer,

    activeForm: activeFormReducer,
    flashMessage: flashMessageReducer,

    subdivisions: subdivisionsReducer,
    plats: platsReducer,
    lots: lotsReducer,

    accounts: accountReducer,
    agreements: agreementsReducer,
    payments: paymentsReducer,
    projects: projectsReducer,
    projectCosts: projectCostsReducer,
    accountLedgers: accountLedgersReducer,

    notes: notesReducer,
    rates: ratesReducer,
    uploads: uploadReducer,
});

export default dashboardReducer;

