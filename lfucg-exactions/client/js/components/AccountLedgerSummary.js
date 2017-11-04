import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Notes from './Notes';

import {
    getAccountLedgerID,
} from '../actions/apiActions';


class AccountLedgerSummary extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            currentUser,
            accountLedgers,
        } = this.props;

        return (
            <div className="accountLedger-summary">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>CREDIT TRANSFER - SUMMARY</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'credit-transfer'} parent_name={'Credit Transfers'} />

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
                                        <h3>Credit Transfer Information</h3>
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
                                                    <Link to={`credit-transfer/form/${accountLedgers.id}`} aria-label="Edit">
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
                                        <p className="col-md-4 col-xs-6">Sewer Credits: {accountLedgers.dollar_values && accountLedgers.dollar_values.dollar_sewer}</p>
                                        <p className="col-md-4 col-xs-6">Non-Sewer Credits: {accountLedgers.dollar_values && accountLedgers.dollar_values.dollar_non_sewer}</p>
                                    </div>
                                </div>
                            </div>
                            {accountLedgers && accountLedgers.id &&
                                <Notes
                                  content_type="accounts_accountledger"
                                  object_id={accountLedgers.id}
                                  ariaExpanded="false"
                                  panelClass="panel-collapse collapse row"
                                  permission="accountledger"
                                />
                            }

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
                                                <h3>Lot</h3>
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
                                                <p className="col-xs-12">Lot Address: {accountLedgers.lot.address_full}</p>
                                                <p className="col-md-4 col-xs-6">Current Exactions: {accountLedgers.lot.lot_exactions && accountLedgers.lot.lot_exactions.current_exactions}</p>
                                                <p className="col-md-4 col-xs-6 ">Lot Number: {accountLedgers.lot.lot_number}</p>
                                                <p className="col-md-4 col-xs-6">Permit ID: {accountLedgers.lot.permit_id}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            :
                                <div className="row section-heading" role="tab" id="headingAccountPlats">
                                    <h3>Lot - None</h3>
                                </div>
                            }

                            {accountLedgers && accountLedgers.account_from && accountLedgers.account_from.id ?
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
                                                <h3>Account From</h3>
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
                                                <p className="col-md-4 col-xs-6">Account From Name: {accountLedgers.account_from.account_name}</p>
                                                <p className="col-md-4 col-xs-6">{accountLedgers.account_from.balance && accountLedgers.account_from.balance.credit_availability}</p>
                                                {currentUser && currentUser.username && <div>
                                                    <p className="col-md-4 col-xs-6">Account Balance: {accountLedgers.account_from.balance && accountLedgers.account_from.balance.balance}</p>
                                                    <p className="col-md-4 col-xs-6">Account From Contact Name: {accountLedgers.account_from.contact_full_name}</p>
                                                    <p className="col-md-4 col-xs-6 ">Account From Phone: {accountLedgers.account_from.phone}</p>
                                                    <p className="col-md-4 col-xs-6">Account From Email: {accountLedgers.account_from.email}</p>
                                                    <p className="col-xs-12">Account From Address: {accountLedgers.account_from.address_full}</p>
                                                </div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            :
                                <div className="row section-heading" role="tab" id="headingAccountPlats">
                                    <h3>Account From - None</h3>
                                </div>
                            }

                            {accountLedgers && accountLedgers.account_to && accountLedgers.account_to.id ?
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
                                                <h3>Account To</h3>
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
                                                <p className="col-md-4 col-xs-6">Account To Name: {accountLedgers.account_to.account_name}</p>
                                                <p className="col-md-4 col-xs-6">{accountLedgers.account_to.balance && accountLedgers.account_to.balance.credit_availability}</p>
                                                {currentUser && currentUser.username && <div>
                                                    <p className="col-md-4 col-xs-6">Account Balance: {accountLedgers.account_to.balance && accountLedgers.account_to.balance.balance}</p>
                                                    <p className="col-md-4 col-xs-6">Account To Contact Name: {accountLedgers.account_to.contact_full_name}</p>
                                                    <p className="col-md-4 col-xs-6 ">Account To Phone: {accountLedgers.account_to.phone}</p>
                                                    <p className="col-md-4 col-xs-6">Account To Email: {accountLedgers.account_to.email}</p>
                                                    <p className="col-xs-12">Account To Address: {accountLedgers.account_to.address_full}</p>
                                                </div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            :
                                <div className="row section-heading" role="tab" id="headingAccountPlats">
                                    <h3>Account To - None</h3>
                                </div>
                            }

                            {accountLedgers && accountLedgers.agreement && accountLedgers.agreement.id ?
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
                                                <h3>Agreement</h3>
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
                                                            <Link to={`agreement/form/${accountLedgers.agreement.id}`} aria-label="Edit">
                                                                <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                                <div className="col-xs-7 link-label">
                                                                    Edit
                                                                </div>
                                                            </Link>
                                                        }
                                                    </div>
                                                    <div className="col-xs-5 ">
                                                        <Link to={`agreement/summary/${accountLedgers.agreement.id}`} aria-label="Summary">
                                                            <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                                            <div className="col-xs-7 link-label">
                                                                Summary
                                                            </div>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xs-12">
                                                <p className="col-md-4 col-xs-6">Current Balance: {accountLedgers.agreement.agreement_balance && accountLedgers.agreement.agreement_balance.total}</p>
                                                <p className="col-md-4 col-xs-6">Resolution Number: {accountLedgers.agreement.resolution_number}</p>
                                                <p className="col-md-4 col-xs-6">Expansion Area: {accountLedgers.agreement.expansion_area}</p>
                                                <p className="col-md-4 col-xs-6">Agreement Type: {accountLedgers.agreement.agreement_type_display}</p>
                                                <p className="col-md-4 col-xs-6">Date Executed: {accountLedgers.agreement.date_executed}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            :
                                <div className="row section-heading" role="tab" id="headingAccountPlats">
                                    <h3>Agreement - None</h3>
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
    accountLedgers: PropTypes.array,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        accountLedgers: state.accountLedgers,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedAccountLedger = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(getAccountLedgerID(selectedAccountLedger));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountLedgerSummary);

