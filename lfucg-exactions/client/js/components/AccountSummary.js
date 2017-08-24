import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

import {
    getAccountID,
    getAccountAgreements,
    getAccountPayments,
    getAccountAccountLedgers,
} from '../actions/apiActions';

class AccountSummary extends React.Component {
    static propTypes = {
        currentUser: React.PropTypes.object,
        accounts: React.PropTypes.object,
        agreements: React.PropTypes.object,
        payments: React.PropTypes.object,
        accountLedgers: React.PropTypes.object,
        route: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
    };

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

        const plats_list = (accounts.plat_account && accounts.plat_account.length > 0) ? (
            map((plat) => {
                return (
                    <div key={plat.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <div className="col-sm-7 col-md-9">
                                <h3>{plat.name}</h3>
                            </div>
                            <div className="col-sm-5 col-md-3">
                                <div className="col-xs-5">
                                    {currentUser && currentUser.permissions && currentUser.permissions.plat &&
                                        <Link to={`plat/form/${plat.id}`} className="btn btn-mid-level">
                                            Edit
                                        </Link>
                                    }
                                </div>
                                <div className="col-xs-5 col-xs-offset-1">
                                    <Link to={`plat/summary/${plat.id}`} className="btn btn-mid-level">
                                        Summary
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <p className="col-md-3 col-sm-4 col-xs-6">Gross Acreage: {plat.cleaned_total_acreage}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Approval: {plat.is_approved ? 'Approved' : 'Not Approved'}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Expansion Area: {plat.expansion_area}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Slide: {plat.slide}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Sewer Exactions: ${plat.sewer_due}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Non-Sewer Exactions: ${plat.non_sewer_due}</p>
                        </div>
                    </div>
                );
            })(accounts.plat_account)
        ) : null;

        const lots_list = (accounts.lot_account && accounts.lot_account.length > 0) ? (
            map((lot) => {
                return (
                    <div key={lot.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <div className="col-sm-7 col-md-9">
                                <h3>{lot.address_full}</h3>
                            </div>
                            <div className="col-sm-5 col-md-3">
                                <div className="col-xs-5">
                                    {currentUser && currentUser.permissions && currentUser.permissions.lot &&
                                        <Link to={`lot/form/${lot.id}`} className="btn btn-mid-level">
                                            Edit
                                        </Link>
                                    }
                                </div>
                                <div className="col-xs-5 col-xs-offset-1">
                                    <Link to={`lot/summary/${lot.id}`} className="btn btn-mid-level">
                                        Summary
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <p className="col-md-3 col-sm-4 col-xs-6">Total Due: {lot.total_due}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Approval: {lot.is_approved ? 'Approved' : 'Not Approved'}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Lot Number: {lot.lot_number}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Parcel ID: {lot.parcel_id}</p>
                        </div>
                    </div>
                );
            })(accounts.lot_account)
        ) : null;

        const agreements_list = (agreements && agreements.length > 0) ? (
            map((agreement) => {
                return (
                    <div key={agreement.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <div className="col-sm-7 col-md-9">
                                <h3>{agreement.resolution_number}</h3>
                            </div>
                            <div className="col-sm-5 col-md-3">
                                <div className="col-xs-5">
                                    {currentUser && currentUser.permissions && currentUser.permissions.agreement &&
                                        <Link to={`agreement/form/${agreement.id}`} className="btn btn-mid-level">
                                            Edit
                                        </Link>
                                    }
                                </div>
                                <div className="col-xs-5 col-xs-offset-1">
                                    <Link to={`agreement/summary/${agreement.id}`} className="btn btn-mid-level">
                                        Summary
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <p className="col-md-3 col-sm-4 col-xs-6">Expansion Area: {agreement.expansion_area}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Agreement Type: {agreement.agreement_type_display}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Date Executed: {agreement.date_executed}</p>
                        </div>
                    </div>
                );
            })(agreements)
        ) : null;

        const payments_list = (payments && payments.length > 0) ? (
            map((payment) => {
                return (
                    <div key={payment.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <div className="col-sm-7 col-md-9">
                                <h3>{payment.payment_category}</h3>
                            </div>
                            <div className="col-sm-5 col-md-3">
                                <div className="col-xs-5">
                                    {currentUser && currentUser.permissions && currentUser.permissions.payment &&
                                        <Link to={`payment/form/${payment.id}`} className="btn btn-mid-level">
                                            Edit
                                        </Link>
                                    }
                                </div>
                                <div className="col-xs-5 col-xs-offset-1">
                                    <Link to={`payment/summary/${payment.id}`} className="btn btn-mid-level">
                                        Summary
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <p className="col-md-3 col-sm-4 col-xs-6">Payment Type: {payment.payment_type}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Lot: {payment.lot_id}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Credit Source: {payment.credit_source}</p>
                        </div>
                    </div>
                );
            })(payments)
        ) : null;

        const accountLedgers_list = (accountLedgers && accountLedgers.length > 0) ? (
            map((accountLedger) => {
                return (
                    <div key={accountLedger.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <div className="col-sm-7 col-md-9">
                                <h3>{accountLedger.entry_type}</h3>
                            </div>
                            <div className="col-sm-5 col-md-3">
                                <div className="col-xs-5">
                                    {currentUser && currentUser.permissions && currentUser.permissions.accountledger &&
                                        <Link to={`account-ledger/form/${accountLedger.id}`} className="btn btn-mid-level">
                                            Edit
                                        </Link>
                                    }
                                </div>
                                <div className="col-xs-5 col-xs-offset-1">
                                    <Link to={`account-ledger/summary/${accountLedger.id}`} className="btn btn-mid-level">
                                        Summary
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <p className="col-md-3 col-sm-4 col-xs-6">Lot: {accountLedger.lot}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Account From: {accountLedger.account_from}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Account To: {accountLedger.account_to}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Agreement: {accountLedger.agreement}</p>
                        </div>
                    </div>
                );
            })(accountLedgers)
        ) : null;

        return (
            <div className="account-summary">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>ACCOUNTS - SUMMARY</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'account'} parent_name={'Accounts'} />

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
                                        <h2>Account Information</h2>
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
                                    <div className="col-xs-12">
                                        <h4 className="col-md-4 col-xs-6">Account Name: {accounts.account_name}</h4>
                                        <h4 className="col-md-4 col-xs-6">Contact Name: {accounts.contact_full_name}</h4>
                                        <h4 className="col-xs-12">Address: {accounts.address_full}</h4>
                                        <h4 className="col-md-4 col-xs-6 ">Phone: {accounts.phone}</h4>
                                        <h4 className="col-md-4 col-xs-6">Email: {accounts.email}</h4>
                                    </div>
                                    {currentUser && currentUser.permissions && currentUser.permissions.accountledger &&
                                        <div className="col-md-offset-11 col-sm-offset-10 col-xs-offset-8">
                                            <Link to={`account/form/${accounts.id}`} role="link" >
                                                <h4>Edit</h4>
                                            </Link>
                                        </div>
                                    }
                                </div>
                            </div>
                            {plats_list ? (
                                <div>
                                    <a
                                      role="button"
                                      data-toggle="collapse"
                                      data-parent="#accordion"
                                      href="#collapseAccountPlats"
                                      aria-expanded="false"
                                      aria-controls="collapseAccountPlats"
                                    >
                                        <div className="row section-heading" role="tab" id="headingAccountPlats">
                                            <div className="col-xs-1 caret-indicator" />
                                            <div className="col-xs-10">
                                                <h2>Account Plats</h2>
                                            </div>
                                        </div>
                                    </a>
                                    <div
                                      id="collapseAccountPlats"
                                      className="panel-collapse collapse row"
                                      role="tabpanel"
                                      aria-labelledby="#headingAccountPlats"
                                    >
                                        <div className="panel-body">
                                            <div className="col-xs-12">
                                                {plats_list}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="row section-heading" role="tab" id="headingAccountPlats">
                                    <h2>Account Plats - None</h2>
                                </div>
                            )}

                            {lots_list ? (
                                <div>
                                    <a
                                      role="button"
                                      data-toggle="collapse"
                                      data-parent="#accordion"
                                      href="#collapseAccountLots"
                                      aria-expanded="false"
                                      aria-controls="collapseAccountLots"
                                    >
                                        <div className="row section-heading" role="tab" id="headingAccountLots">
                                            <div className="col-xs-1 caret-indicator" />
                                            <div className="col-xs-10">
                                                <h2>Account Lots</h2>
                                            </div>
                                        </div>
                                    </a>
                                    <div
                                      id="collapseAccountLots"
                                      className="panel-collapse collapse row"
                                      role="tabpanel"
                                      aria-labelledby="#headingAccountLots"
                                    >
                                        <div className="panel-body">
                                            <div className="col-xs-12">
                                                {lots_list}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="row section-heading" role="tab" id="headingAccountLots">
                                    <h2>Account Lots - None</h2>
                                </div>
                            )}

                            {agreements_list ? (
                                <div>
                                    <a
                                      role="button"
                                      data-toggle="collapse"
                                      data-parent="#accordion"
                                      href="#collapseAccountAgreements"
                                      aria-expanded="false"
                                      aria-controls="collapseAccountAgreements"
                                    >
                                        <div className="row section-heading" role="tab" id="headingAccountAgreements">
                                            <div className="col-xs-1 caret-indicator" />
                                            <div className="col-xs-10">
                                                <h2>Account Agreements</h2>
                                            </div>
                                        </div>
                                    </a>
                                    <div
                                      id="collapseAccountAgreements"
                                      className="panel-collapse collapse row"
                                      role="tabpanel"
                                      aria-labelledby="#headingAccountAgreements"
                                    >
                                        <div className="panel-body">
                                            <div className="col-xs-12">
                                                {agreements_list}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="row section-heading" role="tab" id="headingAccountAgreements">
                                    <h2>Account Agreements - None</h2>
                                </div>
                            )}

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
                                                <h2>Account Payments</h2>
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
                                    <h2>Account Payments - None</h2>
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
                                                <h2>Account Ledgers</h2>
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
                                    <h2>Account Ledgers - None</h2>
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

