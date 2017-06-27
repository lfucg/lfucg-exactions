import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, hashHistory, Redirect } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import dashboardStore from './stores/dashboardStore';

import DashboardPage from './components/DashboardPage';

import Login from './components/LoginPage';
import Registration from './components/RegistrationPage';
import ForgotPassword from './components/ForgotPassword';
import ForgotUsername from './components/ForgotUsername';

global.reduxStore = dashboardStore;
global.BASE_STATIC_URL = '/static';

const history = syncHistoryWithStore(hashHistory, dashboardStore);

ReactDOM.render(
    <Provider store={dashboardStore}>
        <Router history={history}>
            <Redirect from="/" to="dashboard/" />
            <Route path="dashboard/" component={DashboardPage} />

            <Route path="login/" component={Login} />
            <Route path="registration/" component={Registration} />
            <Route path="forgot-password/" component={ForgotPassword} />
            <Route path="forgot-username/" component={ForgotUsername} />
        </Router>
    </Provider>,
    document.getElementById('root'),
);

