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
global.BASE_STATIC_URL = window.location.host === '52.201.224.95' ?
    //'52.201.224.95' :
    'https://s3.amazonaws.com/chef-lfucg/temp_exactions_images' :
    '/static';    
// global.BASE_STATIC_URL = '/static';

const history = syncHistoryWithStore(hashHistory, dashboardStore);

ReactDOM.render(
    <Provider store={dashboardStore}>
        <Router history={history}>
            <Redirect from="/" to="dashboard/" />
            <Route path="dashboard/" component={DashboardPage} name="Home" />

            <Route path="login/" component={Login} name="Login" />
            <Route path="registration/" component={Registration} name="Registration" />
            <Route path="forgot-password/" component={ForgotPassword} name="Forgot Password" />
            <Route path="forgot-username/" component={ForgotUsername} name="Forgot Username" />

            <Route path="subdivision" component={SubdivisionPage} name="Subdivision" />
            <Route path="subdivision/existing" component={SubdivisionExisting} name="Existing Subdivisions" />
            <Route path="subdivision/form" component={SubdivisionForm} name="Subdivision Form" />
            <Route path="subdivision/form/:id" component={SubdivisionForm} name="Current Subdivision Form" />

            <Route path="plat" component={PlatPage} name="Plat" />
            <Route path="plat/existing" component={PlatExisting} name="Existing Plats" />
            <Route path="plat/form" component={PlatForm} name="Plat Form" />
            <Route path="plat/form/:id" component={PlatForm} name="Current Plat Form" />

            <Route path="lot" component={LotPage} name="Lot" />
            <Route path="lot/existing" component={LotExisting} name="Existing Lots" />
            <Route path="lot/form" component={LotForm} name="Lot Form" />
            <Route path="plat/:id/lot/form" component={LotForm} name="Lot Form with Plat" />
            <Route path="lot/form/:id" component={LotForm} name="Current Lot Form" />

        </Router>
    </Provider>,
    document.getElementById('root'),
);

