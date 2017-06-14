import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, hashHistory, Redirect } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import dashboardStore from './stores/dashboardStore';

import DashboardPage from './components/DashboardPage';

global.reduxStore = dashboardStore;
global.BASE_STATIC_URL =
    '/static';


const history = syncHistoryWithStore(hashHistory, dashboardStore);

ReactDOM.render(
    <Provider store={dashboardStore}>
        <Router history={history}>
            <Redirect from="/" to="dashboard/" />
            <Route path="dashboard/" component={DashboardPage} />

        </Router>
    </Provider>,
    document.getElementById('root'),
);

