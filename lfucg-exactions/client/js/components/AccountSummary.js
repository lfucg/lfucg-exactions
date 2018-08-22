import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import {
    formUpdate,
} from '../actions/formActions';

import {
    getAccountID,
    getAccountAgreements,
    getAccountPayments,
    getAccountAccountLedgers,
} from '../actions/apiActions';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Notes from './Notes';
import LoadingScreen from './LoadingScreen';

import PlatsMiniSummary from './PlatsMiniSummary';
import LotsMiniSummary from './LotsMiniSummary';
import AgreementsMiniSummary from './AgreementsMiniSummary';
import AccountLedgersMiniSummary from './AccountLedgersMiniSummary';
import PaymentsMiniSummary from './PaymentsMiniSummary';

class AccountSummary extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            currentUser,
            accounts,
            agreements,
            payments,
            accountLedgers,
            activeForm,
        } = this.props;

        return (
            <div className="account-summary">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>ACCOUNT SUMMARY - {accounts && accounts.currentAccount && accounts.currentAccount.account_name}</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'account'} parent_name={'Developer Accounts'} />

                <div className="inside-body">
                    <div className="container">
                        {accounts.loadingAccount ? <LoadingScreen /> :
                        (
                            <div className="col-md-offset-1 col-md-10 panel-group" id="accordion" role="tablist" aria-multiselectable="false">
                                <a
                                  role="button"
                                  data-toggle="collapse"
                                  data-parent="#accordion"
                                  href="#collapseAccountInfo"
                                  aria-expanded="false"
                                  aria-controls="collapseAccountInfo"
                                >
                                    <div className="row section-heading" role="tab" id="headingAccountInfo">
                                        <div className="col-xs-1 caret-indicator" />
                                        <div className="col-xs-10">
                                            <h3>Developer Account Information</h3>
                                        </div>
                                    </div>
                                </a>
                                <div
                                  id="collapseAccountInfo"
                                  className="panel-collapse collapse row"
                                  role="tabpanel"
                                  aria-labelledby="#headingAccountInfo"
                                >
                                    <div className="panel-body">
                                        <div className="row link-row">
                                            <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                                                <div className="col-xs-5 col-xs-offset-5">
                                                    {currentUser && currentUser.permissions && currentUser.permissions.account &&
                                                        <Link to={`account/form/${accounts.currentAccount.id}`} aria-label={`Edit ${accounts.currentAccount.account_name}`}>
                                                            <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                            <div className="col-xs-7 link-label">
                                                                Edit
                                                            </div>
                                                        </Link>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xs-12">
                                            <p className="col-xs-6">Developer Account Name: {accounts.currentAccount.account_name}</p>
                                            {accounts.currentAccount.balance && <p className="col-xs-6"><strong>{accounts.currentAccount.balance.credit_availability}</strong></p>}
                                            {currentUser && currentUser.username && <div>
                                                <p className="col-xs-6">Contact Name: {accounts.currentAccount.contact_full_name}</p>
                                                {accounts.currentAccount.balance && <p className="col-xs-6">Account Balance: {accounts.currentAccount.balance.balance}</p>}
                                                <p className="col-xs-6 ">Phone: {accounts.currentAccount.phone}</p>
                                                <p className="col-xs-6">Email: {accounts.currentAccount.email}</p>
                                                <p className="col-xs-12">Address: {accounts.currentAccount.address_full}</p>
                                            </div>}
                                        </div>
                                    </div>
                                </div>
                                {accounts && accounts.currentAccount.id &&
                                    <Notes
                                      content_type="accounts_account"
                                      object_id={accounts.currentAccount.id}
                                      ariaExpanded="false"
                                      panelClass="panel-collapse collapse row"
                                      permission="account"
                                    />
                                }

                                <PlatsMiniSummary
                                  mapSet={accounts.currentAccount.plat_account}
                                  mapQualifier={accounts.currentAccount.plat_account && accounts.currentAccount.plat_account.length > 0}
                                />

                                <LotsMiniSummary
                                  mapSet={accounts.currentAccount.lot_account}
                                  mapQualifier={accounts.currentAccount.lot_account && accounts.currentAccount.lot_account.length > 0}
                                />

                                <AgreementsMiniSummary
                                  mapSet={agreements}
                                  mapQualifier={agreements && agreements.length > 0}
                                />

                                <PaymentsMiniSummary
                                  mapSet={payments}
                                  mapQualifier={payments && payments.length > 0}
                                />

                                <AccountLedgersMiniSummary
                                  mapSet={accountLedgers.accountLedgers}
                                  mapQualifier={accountLedgers && accountLedgers.accountLedgers && accountLedgers.accountLedgers.length > 0}
                                  accountLedgers={accountLedgers}
                                />

                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

AccountSummary.propTypes = {
    currentUser: PropTypes.object,
    accounts: PropTypes.array,
    agreements: PropTypes.array,
    payments: PropTypes.array,
    accountLedgers: PropTypes.array,
    route: PropTypes.object,
    activeForm: PropTypes.object,
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        accounts: state.accounts,
        accountLedgers: state.accountLedgers,
        agreements: !!state.agreements && !!state.agreements.agreements && state.agreements.agreements,
        payments: !!state.payments && !!state.payments.payments && state.payments.payments,
        activeForm: state.activeForm,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedAccount = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(getAccountID(selectedAccount));
            dispatch(getAccountAgreements(selectedAccount));
            dispatch(getAccountPayments(selectedAccount));
            dispatch(getAccountAccountLedgers(selectedAccount))
            .then(() => {
                dispatch(formUpdate({ loading: false }));
            });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountSummary);

