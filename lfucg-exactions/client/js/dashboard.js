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

import SubdivisionExisting from './components/SubdivisionExisting';
import SubdivisionForm from './components/SubdivisionForm';
import SubdivisionSummary from './components/SubdivisionSummary';

import PlatExisting from './components/PlatExisting';
import PlatForm from './components/PlatForm';
import PlatSummary from './components/PlatSummary';
import PlatReport from './components/PlatReport';

import LotExisting from './components/LotExisting';
import LotForm from './components/LotForm';
import LotSummary from './components/LotSummary';

import AccountExisting from './components/AccountExisting';
import AccountSummary from './components/AccountSummary';
import AccountForm from './components/AccountForm';

import AgreementExisting from './components/AgreementExisting';
import AgreementSummary from './components/AgreementSummary';
import AgreementForm from './components/AgreementForm';

import PaymentExisting from './components/PaymentExisting';
import PaymentSummary from './components/PaymentSummary';
import PaymentForm from './components/PaymentForm';

import ProjectExisting from './components/ProjectExisting';
import ProjectSummary from './components/ProjectSummary';
import ProjectForm from './components/ProjectForm';

import ProjectCostExisting from './components/ProjectCostExisting';
import ProjectCostSummary from './components/ProjectCostSummary';
import ProjectCostForm from './components/ProjectCostForm';

import AccountLedgerExisting from './components/AccountLedgerExisting';
import AccountLedgerSummary from './components/AccountLedgerSummary';
import AccountLedgerForm from './components/AccountLedgerForm';

global.reduxStore = dashboardStore;
// global.BASE_STATIC_URL = (window.location.host === '52.201.224.95') ?
//     //'52.201.224.95' :
//     'https://s3.amazonaws.com/chef-lfucg/temp_exactions_images' :
//     '/static';
// global.BASE_STATIC_URL = '/static';

const history = syncHistoryWithStore(hashHistory, dashboardStore);
global.Promise = require('bluebird');
global.PropTypes = require('prop-types');

ReactDOM.render(
    <Provider store={dashboardStore}>
        <Router history={history}>
            <Redirect from="/" to="dashboard/" />
            <Route path="dashboard/" component={DashboardPage} name="Home" />

            <Route path="login/" component={Login} name="Login" />
            <Route path="registration/" component={Registration} name="Registration" />
            <Route path="forgot-password/" component={ForgotPassword} name="Forgot Password" />
            <Route path="forgot-username/" component={ForgotUsername} name="Forgot Username" />

            <Route path="subdivision" component={SubdivisionExisting} name="Existing Subdivisions" />
            <Route path="subdivision/summary/:id" component={SubdivisionSummary} name="Subdivision Summary" />
            <Route path="subdivision/form" component={SubdivisionForm} name="Subdivision Form" />
            <Route path="subdivision/form/:id" component={SubdivisionForm} name="Current Subdivision Form" />

            <Route path="plat" component={PlatExisting} name="Existing Plats" />
            <Route path="plat/summary/:id" component={PlatSummary} name="Plat Summary" />
            <Route path="plat/form" component={PlatForm} name="Plat Form" />
            <Route path="plat/form/:id" component={PlatForm} name="Current Plat Form" />
            <Route path="plat/report/:id" component={PlatReport} name="Plat Report" />

            <Route path="lot" component={LotExisting} name="Existing Lots" />
            <Route path="lot/summary/:id" component={LotSummary} name="Lot Summary" />
            <Route path="lot/form" component={LotForm} name="Lot Form" />
            <Route path="plat/:id/lot/form" component={LotForm} name="Lot Form with Plat" />
            <Route path="lot/form/:id" component={LotForm} name="Current Lot Form" />

            <Route path="account" component={AccountExisting} name="Existing Developer Accounts" />
            <Route path="account/summary/:id" component={AccountSummary} name="Developer Account Summary" />
            <Route path="account/form" component={AccountForm} name="Developer Account Form" />
            <Route path="account/form/:id" component={AccountForm} name="Current Developer Account Form" />

            <Route path="agreement" component={AgreementExisting} name="Existing Agreements" />
            <Route path="agreement/summary/:id" component={AgreementSummary} name="Agreement Summary" />
            <Route path="agreement/form" component={AgreementForm} name="Agreement Form" />
            <Route path="agreement/form/:id" component={AgreementForm} name="Current Agreement Form" />

            <Route path="payment" component={PaymentExisting} name="Existing Payments" />
            <Route path="payment/summary/:id" component={PaymentSummary} name="Payment Summary" />
            <Route path="payment/form" component={PaymentForm} name="Payment Form" />
            <Route path="payment/form/:id" component={PaymentForm} name="Current Payment Form" />

            <Route path="project" component={ProjectExisting} name="Existing Projects" />
            <Route path="project/summary/:id" component={ProjectSummary} name="Project Summary" />
            <Route path="project/form" component={ProjectForm} name="Project Form" />
            <Route path="project/form/:id" component={ProjectForm} name="Current Project Form" />

            <Route path="project-cost" component={ProjectCostExisting} name="Existing Project Costs" />
            <Route path="project-cost/summary/:id" component={ProjectCostSummary} name="Project Cost Summary" />
            <Route path="project-cost/form" component={ProjectCostForm} name="Project Cost Form" />
            <Route path="project-cost/form/:id" component={ProjectCostForm} name="Current Project Cost Form" />

            <Route path="credit-transfer" component={AccountLedgerExisting} name="Existing Credit Transfers" />
            <Route path="credit-transfer/summary/:id" component={AccountLedgerSummary} name="Credit Transfer Summary" />
            <Route path="credit-transfer/form" component={AccountLedgerForm} name="Credit Transfer Form" />
            <Route path="credit-transfer/form/:id" component={AccountLedgerForm} name="Current Credit Transfer Form" />

        </Router>
    </Provider>,
    document.getElementById('root'),
);
