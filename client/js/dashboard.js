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

import SubdivisionPage from './components/SubdivisionPage';
import SubdivisionExisting from './components/SubdivisionExisting';
import SubdivisionForm from './components/SubdivisionForm';

import PlatPage from './components/PlatPage';
import PlatExisting from './components/PlatExisting';
import PlatForm from './components/PlatForm';

import LotPage from './components/LotPage';
import LotExisting from './components/LotExisting';
import LotForm from './components/LotForm';

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

            <Route path="subdivision" component={SubdivisionPage} />
            <Route path="subdivision/existing" component={SubdivisionExisting} />
            <Route path="subdivision/form" component={SubdivisionForm} />
            <Route path="subdivision/form/:id" component={SubdivisionForm} />

            <Route path="plat" component={PlatPage} />
            <Route path="plat/existing" component={PlatExisting} />
            <Route path="plat/form" component={PlatForm} />
            <Route path="plat/form/:id" component={PlatForm} />

            <Route path="lot" component={LotPage} />
            <Route path="lot/existing" component={LotExisting} />
            <Route path="lot/form" component={LotForm} />
            <Route path="lot/form/:id" component={LotForm} />

        </Router>
    </Provider>,
    document.getElementById('root'),
);

