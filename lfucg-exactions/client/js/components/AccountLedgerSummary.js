import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

import {
    getLotID,
    getAccountID,
    getAgreementID,
    getAccountLedgerID,
} from '../actions/apiActions';

import {
    formUpdate,
} from '../actions/formActions';

class AccountLedgerSummary extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            currentUser,
            activeForm,
            lots,
            accounts,
            agreements,
            accountLedgers,
        } = this.props;

        return (
            <div className="accountLedger-summary">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>ACCOUNT LEDGER - SUMMARY</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'account-ledger'} parent_name={'Account Ledgers'} />

                <div className="inside-body">
                    <div className="container">
                        <div className="col-md-offset-1 col-md-10 panel-group" id="accordion" role="tablist" aria-multiselectable="false">
                            <a
                              role="button"
                              data-toggle="collapse"
                              data-parent="#accordion"
                              href="#collapseAccountLedgerInfo"
                              aria-expanded="false"
                              aria-controls="collapseAccountLedgerInfo"
                            >
                                <div className="row section-heading" role="tab" id="headingAccountLedgerInfo">
                                    <div className="col-xs-1 caret-indicator" />
                                    <div className="col-xs-10">
                                        <h2>Account Ledger Information</h2>
                                    </div>
                                </div>
                            </a>
                            <div
                              id="collapseAccountLedgerInfo"
                              className="panel-collapse collapse row"
                              role="tabpanel"
                              aria-labelledby="#headingAccountLedgerInfo"
                            >
                                <div className="panel-body">
                                    <div className="row link-row">
                                        <div className="col-xs-12 col-sm-5 col-md-3 col-sm-offset-7 col-md-offset-9">
                                            <div className="col-xs-5 col-xs-offset-5">
                                                {currentUser && currentUser.permissions && currentUser.permissions.accountledger &&
                                                    <Link to={`account-ledger/form/${accountLedgers.id}`} aria-label="Edit">
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
                                        <p className="col-md-4 col-xs-6">Entry Type: {accountLedgers.entry_type_display}</p>
                                        <p className="col-md-4 col-xs-6">Sewer Credits: {accountLedgers.sewer_credits}</p>
                                        <p className="col-md-4 col-xs-6">Non-Sewer Credits: {accountLedgers.non_sewer_credits}</p>
                                    </div>
                                </div>
                            </div>

                            {(accountLedgers.lot && accountLedgers.lot.id) ?
                                <div>
                                    <a
                                      role="button"
                                      data-toggle="collapse"
                                      data-parent="#accordion"
                                      href="#collapseLotInfo"
                                      aria-expanded="false"
                                      aria-controls="collapseLotInfo"
                                    >
                                        <div className="row section-heading" role="tab" id="headingLotInfo">
                                            <div className="col-xs-1 caret-indicator" />
                                            <div className="col-xs-10">
                                                <h2>Lot</h2>
                                            </div>
                                        </div>
                                    </a>
                                    <div
                                      id="collapseLotInfo"
                                      className="panel-collapse collapse row"
                                      role="tabpanel"
                                      aria-labelledby="#headingLotInfo"
                                    >
                                        <div className="panel-body">
                                            <div className="row link-row">
                                                <div className="col-xs-12 col-sm-5 col-md-3 col-sm-offset-7 col-md-offset-9">
                                                    <div className="col-xs-5">
                                                        {currentUser && currentUser.permissions && currentUser.permissions.lot &&
                                                            <Link to={`lot/form/${accountLedgers.lot.id}`} aria-label="Edit">
                                                                <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                                <div className="col-xs-7 link-label">
                                                                    Edit
                                                                </div>
                                                            </Link>
                                                        }
                                                    </div>
                                                    <div className="col-xs-5 ">
                                                        <Link to={`lot/summary/${accountLedgers.lot.id}`} aria-label="Summary">
                                                            <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                                            <div className="col-xs-7 link-label">
                                                                Summary
                                                            </div>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xs-12">
                                                <h4 className="col-xs-12">Lot Address: {accountLedgers.lot.address_full}</h4>
                                                <h4 className="col-md-4 col-xs-6">Total Exactions: {accountLedgers.lot.total_due}</h4>
                                                <h4 className="col-md-4 col-xs-6 ">Lot Number: {accountLedgers.lot.lot_number}</h4>
                                                <h4 className="col-md-4 col-xs-6">Permit ID: {accountLedgers.lot.permit_id}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            :
                                <div className="row section-heading" role="tab" id="headingAccountPlats">
                                    <h2>Lot - None</h2>
                                </div>
                            }

                            {activeForm.account_from_name ?
                                <div>
                                    <a
                                      role="button"
                                      data-toggle="collapse"
                                      data-parent="#accordion"
                                      href="#collapseAccountFromInfo"
                                      aria-expanded="false"
                                      aria-controls="collapseAccountFromInfo"
                                    >
                                        <div className="row section-heading" role="tab" id="headingAccountFromInfo">
                                            <div className="col-xs-1 caret-indicator" />
                                            <div className="col-xs-10">
                                                <h2>Account From</h2>
                                            </div>
                                        </div>
                                    </a>
                                    <div
                                      id="collapseAccountFromInfo"
                                      className="panel-collapse collapse row"
                                      role="tabpanel"
                                      aria-labelledby="#headingAccountFromInfo"
                                    >
                                        <div className="panel-body">
                                            <div className="row link-row">
                                                <div className="col-xs-12 col-sm-5 col-md-3 col-sm-offset-7 col-md-offset-9">
                                                    <div className="col-xs-5">
                                                        {currentUser && currentUser.permissions && currentUser.permissions.account &&
                                                            <Link to={`account/form/${accountLedgers.account_from.id}`} aria-label="Edit">
                                                                <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                                <div className="col-xs-7 link-label">
                                                                    Edit
                                                                </div>
                                                            </Link>
                                                        }
                                                    </div>
                                                    <div className="col-xs-5 ">
                                                        <Link to={`account/summary/${accountLedgers.account_from.id}`} aria-label="Summary">
                                                            <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                                            <div className="col-xs-7 link-label">
                                                                Summary
                                                            </div>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xs-12">
                                                <h4 className="col-md-4 col-xs-6">Account From Name: {activeForm.account_from_name}</h4>
                                                {currentUser && currentUser.username && <div>
                                                    <h4 className="col-md-4 col-xs-6">Account From Contact Name: {activeForm.account_from_contact_full_name}</h4>
                                                    <h4 className="col-md-4 col-xs-6">Account From Address: {activeForm.account_from_address_full}</h4>
                                                    <h4 className="col-md-4 col-xs-6 ">Account From Phone: {activeForm.account_from_phone}</h4>
                                                    <h4 className="col-md-4 col-xs-6">Account From Email: {activeForm.account_from_email}</h4>
                                                </div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            :
                                <div className="row section-heading" role="tab" id="headingAccountPlats">
                                    <h2>Account From - None</h2>
                                </div>
                            }

                            {activeForm.account_to_name ?
                                <div>
                                    <a
                                      role="button"
                                      data-toggle="collapse"
                                      data-parent="#accordion"
                                      href="#collapseAccountToInfo"
                                      aria-expanded="false"
                                      aria-controls="collapseAccountToInfo"
                                    >
                                        <div className="row section-heading" role="tab" id="headingAccountToInfo">
                                            <div className="col-xs-1 caret-indicator" />
                                            <div className="col-xs-10">
                                                <h2>Account To</h2>
                                            </div>
                                        </div>
                                    </a>
                                    <div
                                      id="collapseAccountToInfo"
                                      className="panel-collapse collapse row"
                                      role="tabpanel"
                                      aria-labelledby="#headingAccountToInfo"
                                    >
                                        <div className="panel-body">
                                            <div className="row link-row">
                                                <div className="col-xs-12 col-sm-5 col-md-3 col-sm-offset-7 col-md-offset-9">
                                                    <div className="col-xs-5">
                                                        {currentUser && currentUser.permissions && currentUser.permissions.account &&
                                                            <Link to={`account/form/${accountLedgers.account_to.id}`} aria-label="Edit">
                                                                <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                                <div className="col-xs-7 link-label">
                                                                    Edit
                                                                </div>
                                                            </Link>
                                                        }
                                                    </div>
                                                    <div className="col-xs-5 ">
                                                        <Link to={`account/summary/${accountLedgers.account_to.id}`} aria-label="Summary">
                                                            <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                                            <div className="col-xs-7 link-label">
                                                                Summary
                                                            </div>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xs-12">
                                                <h4 className="col-md-4 col-xs-6">Account To Name: {activeForm.account_to_name}</h4>
                                                {currentUser && currentUser.username && <div>
                                                    <h4 className="col-md-4 col-xs-6">Account To Contact Name: {activeForm.account_to_contact_full_name}</h4>
                                                    <h4 className="col-md-4 col-xs-6">Account To Address: {activeForm.account_to_address_full}</h4>
                                                    <h4 className="col-md-4 col-xs-6 ">Account To Phone: {activeForm.account_to_phone}</h4>
                                                    <h4 className="col-md-4 col-xs-6">Account To Email: {activeForm.account_to_email}</h4>
                                                </div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            :
                                <div className="row section-heading" role="tab" id="headingAccountPlats">
                                    <h2>Account To - None</h2>
                                </div>
                            }

                            {agreements && agreements.id ?
                                <div>
                                    <a
                                      role="button"
                                      data-toggle="collapse"
                                      data-parent="#accordion"
                                      href="#collapseAgreementInfo"
                                      aria-expanded="false"
                                      aria-controls="collapseAgreementInfo"
                                    >
                                        <div className="row section-heading" role="tab" id="headingAgreementInfo">
                                            <div className="col-xs-1 caret-indicator" />
                                            <div className="col-xs-10">
                                                <h2>Agreement</h2>
                                            </div>
                                        </div>
                                    </a>
                                    <div
                                      id="collapseAgreementInfo"
                                      className="panel-collapse collapse row"
                                      role="tabpanel"
                                      aria-labelledby="#headingAgreementInfo"
                                    >
                                        <div className="panel-body">
                                            <div className="row link-row">
                                                <div className="col-xs-12 col-sm-5 col-md-3 col-sm-offset-7 col-md-offset-9">
                                                    <div className="col-xs-5">
                                                        {currentUser && currentUser.permissions && currentUser.permissions.agreement &&
                                                            <Link to={`agreement/form/${agreements.id}`} aria-label="Edit">
                                                                <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                                <div className="col-xs-7 link-label">
                                                                    Edit
                                                                </div>
                                                            </Link>
                                                        }
                                                    </div>
                                                    <div className="col-xs-5 ">
                                                        <Link to={`agreement/summary/${agreements.id}`} aria-label="Summary">
                                                            <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                                            <div className="col-xs-7 link-label">
                                                                Summary
                                                            </div>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xs-12">
                                                <p className="col-md-4 col-xs-6">Resolution Number: {agreements.resolution_number}</p>
                                                <p className="col-md-4 col-xs-6">Expansion Area: {agreements.expansion_area}</p>
                                                <p className="col-md-4 col-xs-6">Agreement Type: {agreements.agreement_type_display}</p>
                                                <p className="col-md-4 col-xs-6">Date Executed: {agreements.date_executed}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            :
                                <div className="row section-heading" role="tab" id="headingAccountPlats">
                                    <h2>Agreement - None</h2>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

AccountLedgerSummary.propTypes = {
    currentUser: PropTypes.object,
    activeForm: PropTypes.object,
    lots: PropTypes.object,
    accounts: PropTypes.object,
    agreements: PropTypes.object,
    accountLedgers: PropTypes.object,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        activeForm: state.activeForm,
        lots: state.lots,
        accounts: state.accounts,
        agreements: state.agreements,
        accountLedgers: state.accountLedgers,
        projects: state.projects,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedAccountLedger = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(getAccountLedgerID(selectedAccountLedger))
            .then((data_accountLedger) => {
                // if (data_accountLedger.response.lot) {
                //     dispatch(getLotID(data_accountLedger.response.lot));
                // }
                if (data_accountLedger.response.agreement) {
                    dispatch(getAgreementID(data_accountLedger.response.agreement));
                }
                if (data_accountLedger.response.account_from) {
                    dispatch(getAccountID(data_accountLedger.response.account_from))
                    .then((data_account_from) => {
                        const account_from = {
                            account_from_name: data_account_from.response.account_name,
                            account_from_contact_full_name: data_account_from.response.contact_full_name,
                            account_from_address_full: data_account_from.response.address_full,
                            account_from_phone: data_account_from.response.phone,
                            account_from_email: data_account_from.response.email,
                        };
                        dispatch(formUpdate(account_from));
                    });
                }
                if (data_accountLedger.response.account_to) {
                    dispatch(getAccountID(data_accountLedger.response.account_to))
                    .then((data_account_to) => {
                        const account_to = {
                            account_to_name: data_account_to.response.account_name,
                            account_to_contact_full_name: data_account_to.response.contact_full_name,
                            account_to_address_full: data_account_to.response.address_full,
                            account_to_phone: data_account_to.response.phone,
                            account_to_email: data_account_to.response.email,
                        };
                        dispatch(formUpdate(account_to));
                    });
                }
            });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountLedgerSummary);

