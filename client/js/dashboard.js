import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, hashHistory, Redirect } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import dashboardStore from './stores/dashboardStore';

import DashboardPage from './components/DashboardPage';

import SubdivisionPage from './components/SubdivisionPage';
import SubdivisionForm from './components/SubdivisionForm';
import PlatPage from './components/PlatPage';
import PlatForm from './components/PlatForm';

global.reduxStore = dashboardStore;
global.BASE_STATIC_URL =
    '/static';


const history = syncHistoryWithStore(hashHistory, dashboardStore);

ReactDOM.render(
    <Provider store={dashboardStore}>
        <Router history={history}>
            <Redirect from="/" to="dashboard/" />
            <Route path="dashboard/" component={DashboardPage} />

            <Route path="subdivision-page" component={SubdivisionPage} />
            <Route path="subdivision-form" component={SubdivisionForm} />
            <Route path="plat-page" component={PlatPage} />
            <Route path="plat-form" component={PlatForm} />
        </Router>
    </Provider>,
    document.getElementById('root'),
);

