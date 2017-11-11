import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Notes from './Notes';

import PlatsMiniSummary from './PlatsMiniSummary';
import LotsMiniSummary from './LotsMiniSummary';
import AgreementsMiniSummary from './AgreementsMiniSummary';

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

        const payments_list = payments && payments.length > 0 &&
            map((payment) => {
                return (
                    <div key={payment.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <h3>Agreement Resolution: {payment.credit_source && payment.credit_source.resolution_number}</h3>
                        </div>
                        <div className="row link-row">
                            <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                                <div className="col-xs-5">
                                    {currentUser && currentUser.permissions && currentUser.permissions.payment &&
                                        <Link to={`payment/form/${payment.id}`} aria-label="Edit">
                                            <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                            <div className="col-xs-7 link-label">
                                                Edit
                                            </div>
                                        </Link>
                                    }
                                </div>
                                <div className="col-xs-5 ">
                                    <Link to={`payment/summary/${payment.id}`} aria-label="Summary">
                                        <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                        <div className="col-xs-7 link-label">
                                            Summary
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <h3 className="col-xs-12">Payment Total: {payment.total_paid}</h3>
                            <p className="col-xs-6">Paid Sewer: ${(parseFloat(payment.paid_sewer_cap) + parseFloat(payment.paid_sewer_trans)).toLocaleString('en')}</p>
                            <p className="col-xs-6">Paid Non-Sewer: ${(parseFloat(payment.paid_open_space) + parseFloat(payment.paid_parks) + parseFloat(payment.paid_roads) + parseFloat(payment.paid_storm)).toLocaleString('en')}</p>
                            <p className="col-xs-6">Paid By: {payment.paid_by} ({payment.paid_by_type_display})</p>
                            <p className="col-xs-6">Payment Type: {payment.payment_type_display} {payment.check_number ? `(#${payment.check_number})` : null}</p>
                            <p className="col-xs-12">Lot: {payment.lot_id.address_full}</p>
                        </div>
                    </div>
                );
            })(payments);

        const accountLedgers_list = accountLedgers && accountLedgers.length > 0 &&
            map((accountLedger) => {
                return (
                    <div key={accountLedger.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <h3>{accountLedger.entry_type_display}</h3>
                        </div>
                        <div className="row link-row">
                            <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                                <div className="col-xs-5">
                                    {currentUser && currentUser.permissions && currentUser.permissions.accountledger &&
                                        <Link to={`credit-transfer/form/${accountLedger.id}`} aria-label="Edit">
                                            <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                            <div className="col-xs-7 link-label">
                                                Edit
                                            </div>
                                        </Link>
                                    }
                                </div>
                                <div className="col-xs-5 ">
                                    <Link to={`credit-transfer/summary/${accountLedger.id}`} aria-label="Summary">
                                        <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                        <div className="col-xs-7 link-label">
                                            Summary
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <p className="col-sm-4 col-xs-6">Account From: {accountLedger.account_from.account_name}</p>
                            <p className="col-sm-4 col-xs-6">Account To: {accountLedger.account_to.account_name}</p>
                            <p className="col-sm-4 col-xs-6">Agreement: {accountLedger.agreement.resolution_number}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Non-Sewer Credits: {accountLedger.dollar_values && accountLedger.dollar_values.dollar_non_sewer}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Sewer Credits: {accountLedger.dollar_values && accountLedger.dollar_values.dollar_sewer}</p>
                            <p className="col-xs-12">Lot: {accountLedger.lot && accountLedger.lot.address_full}</p>
                        </div>
                    </div>
                );
            })(accountLedgers);

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

                            {payments_list ? (
                                <div>
                                    <a
                                      role="button"
                                      data-toggle="collapse"
                                      data-parent="#accordion"
                                      href="#collapseAccountPayments"
                                      aria-expanded="false"
                                      aria-controls="collapseAccountPayments"
                                    >
                                        <div className="row section-heading" role="tab" id="headingAccountPayments">
                                            <div className="col-xs-1 caret-indicator" />
                                            <div className="col-xs-10">
                                                <h3>Payments</h3>
                                            </div>
                                        </div>
                                    </a>
                                    <div
                                      id="collapseAccountPayments"
                                      className="panel-collapse collapse row"
                                      role="tabpanel"
                                      aria-labelledby="#headingAccountPayments"
                                    >
                                        <div className="panel-body">
                                            <div className="col-xs-12">
                                                {payments_list}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="row section-heading" role="tab" id="headingAccountPayments">
                                    <h3>Payments - None</h3>
                                </div>
                            )}

                            {accountLedgers_list ? (
                                <div>
                                    <a
                                      role="button"
                                      data-toggle="collapse"
                                      data-parent="#accordion"
                                      href="#collapseAccountLedgers"
                                      aria-expanded="false"
                                      aria-controls="collapseAccountLedgers"
                                    >
                                        <div className="row section-heading" role="tab" id="headingAccountLedgers">
                                            <div className="col-xs-1 caret-indicator" />
                                            <div className="col-xs-10">
                                                <h3>Credit Transfers</h3>
                                            </div>
                                        </div>
                                    </a>
                                    <div
                                      id="collapseAccountLedgers"
                                      className="panel-collapse collapse row"
                                      role="tabpanel"
                                      aria-labelledby="#headingAccountLedgers"
                                    >
                                        <div className="panel-body">
                                            <div className="col-xs-12">
                                                {accountLedgers_list}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="row section-heading" role="tab" id="headingAccountLedgers">
                                    <h3>Credit Transfers - None</h3>
                                </div>
                            )}

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

