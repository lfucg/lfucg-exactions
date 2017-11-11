import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Notes from './Notes';

import PlatsMiniSummary from './PlatsMiniSummary';
import LotsMiniSummary from './LotsMiniSummary';
import AgreementsMiniSummary from './AgreementsMiniSummary';
import AccountLedgersMiniSummary from './AccountLedgersMiniSummary';
import PaymentsMiniSummary from './PaymentsMiniSummary';

import {
    getAccountID,
    getAccountAgreements,
    getAccountPayments,
    getAccountAccountLedgers,
} from '../actions/apiActions';

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
        } = this.props;

        return (
            <div className="account-summary">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>ACCOUNTS - SUMMARY</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'account'} parent_name={'Developer Accounts'} />

                <div className="inside-body">
                    <div className="container">
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
                                                    <Link to={`account/form/${accounts.id}`} aria-label="Edit">
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
                                        <p className="col-xs-6">Developer Account Name: {accounts.account_name}</p>
                                        {accounts.balance && <p className="col-xs-6"><strong>{accounts.balance.credit_availability}</strong></p>}
                                        {currentUser && currentUser.username && <div>
                                            <p className="col-xs-6">Contact Name: {accounts.contact_full_name}</p>
                                            {accounts.balance && <p className="col-xs-6">Account Balance: {accounts.balance.balance}</p>}
                                            <p className="col-xs-6 ">Phone: {accounts.phone}</p>
                                            <p className="col-xs-6">Email: {accounts.email}</p>
                                            <p className="col-xs-12">Address: {accounts.address_full}</p>
                                        </div>}
                                    </div>
                                </div>
                            </div>
                            {accounts && accounts.id &&
                                <Notes
                                  content_type="accounts_account"
                                  object_id={accounts.id}
                                  ariaExpanded="false"
                                  panelClass="panel-collapse collapse row"
                                  permission="account"
                                />
                            }

                            <PlatsMiniSummary
                              mapSet={accounts.plat_account}
                              mapQualifier={accounts.plat_account && accounts.plat_account.length > 0}
                            />

                            <LotsMiniSummary
                              mapSet={accounts.lot_account}
                              mapQualifier={accounts.lot_account && accounts.lot_account.length > 0}
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
                              mapSet={accountLedgers}
                              mapQualifier={accountLedgers && accountLedgers.length > 0}
                            />

                        </div>
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
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        accounts: state.accounts,
        agreements: state.agreements,
        payments: state.payments,
        accountLedgers: state.accountLedgers,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedAccount = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(getAccountID(selectedAccount));
            dispatch(getAccountAgreements(selectedAccount));
            dispatch(getAccountPayments(selectedAccount));
            dispatch(getAccountAccountLedgers(selectedAccount));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountSummary);

