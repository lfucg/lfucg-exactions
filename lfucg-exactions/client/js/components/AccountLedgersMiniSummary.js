import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { map } from 'ramda';
import PropTypes from 'prop-types';

class AccountLedgersMiniSummary extends React.Component {
    render() {
        const {
            currentUser,
        } = this.props;

        const ledgersList = this.props.mapQualifier && this.props.singleAccountLedger ?
            (<div>
                <div className="row link-row">
                    <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                        <div className="col-xs-5">
                            {currentUser && currentUser.permissions && currentUser.permissions.accountledger &&
                                <Link to={`credit-transfer/form/${this.props.mapSet.id}`} aria-label={`Edit ${this.props.mapSet.entry_date}`}>
                                    <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                    <div className="col-xs-7 link-label">
                                        Edit
                                    </div>
                                </Link>
                            }
                        </div>
                        <div className="col-xs-5 ">
                            <Link to={`credit-transfer/summary/${this.props.mapSet.id}`} aria-label={`${this.props.mapSet.entry_date} Summary`}>
                                <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                <div className="col-xs-7 link-label">
                                    Summary
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-xs-12">
                    <p className="col-xs-6">Entry Type: {this.props.mapSet.entry_type_display}</p>
                    <p className="col-xs-6">Agreement Resolution: {this.props.mapSet.agreement && this.props.mapSet.agreement.resolution_number}</p>
                    <p className="col-xs-6">Account From: {this.props.mapSet.account_from && this.props.mapSet.account_from.account_name}</p>
                    <p className="col-xs-6">Account To: {this.props.mapSet.account_to && this.props.mapSet.account_to.account_name}</p>
                    <p className="col-xs-6">Non-Sewer Credits: {this.props.mapSet.dollar_values && this.props.mapSet.dollar_values.dollar_non_sewer}</p>
                    <p className="col-xs-6">Sewer Credits: {this.props.mapSet.dollar_values && this.props.mapSet.dollar_values.dollar_sewer}</p>
                </div>
            </div>) : (
                this.props.mapQualifier && map((ledger) => {
                    return (
                        <div key={ledger.id} className="col-xs-12">
                            <div className="row form-subheading">
                                <h3>{ledger.entry_date}</h3>
                            </div>
                            <div className="row link-row">
                                <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                                    <div className="col-xs-5">
                                        {currentUser && currentUser.permissions && currentUser.permissions.accountledger &&
                                            <Link to={`credit-transfer/form/${ledger.id}`} aria-label={`Edit ${ledger.entry_date}`}>
                                                <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                <div className="col-xs-7 link-label">
                                                    Edit
                                                </div>
                                            </Link>
                                        }
                                    </div>
                                    <div className="col-xs-5 ">
                                        <Link to={`credit-transfer/summary/${ledger.id}`} aria-label={`${ledger.entry_date} Summary`}>
                                            <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                            <div className="col-xs-7 link-label">
                                                Summary
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <p className="col-xs-6">Entry Type: {ledger.entry_type_display}</p>
                                <p className="col-xs-6">Agreement Resolution: {ledger.agreement && ledger.agreement.resolution_number}</p>
                                <p className="col-xs-6">Account From: {ledger.account_from && ledger.account_from.account_name}</p>
                                <p className="col-xs-6">Account To: {ledger.account_to && ledger.account_to.account_name}</p>
                                <p className="col-xs-6">Non-Sewer Credits: {ledger.dollar_values && ledger.dollar_values.dollar_non_sewer}</p>
                                <p className="col-xs-6">Sewer Credits: {ledger.dollar_values && ledger.dollar_values.dollar_sewer}</p>
                            </div>
                        </div>
                    );
                })(this.props.mapSet)
            )
        ;

        return (
            <div className="existing-page-links">
                {ledgersList ? (
                    <div>
                        <a
                          role="button"
                          data-toggle="collapse"
                          data-parent="#accordion"
                          href="#collapseAccountAccountLedgers"
                          aria-expanded="false"
                          aria-controls="collapseAccountAccountLedgers"
                        >
                            <div className="row section-heading" role="tab" id="headingAccountAccountLedgers">
                                <div className="col-xs-1 caret-indicator" />
                                <div className="col-xs-10">
                                    {!this.props.singleAccountLedger ?
                                        <h3>Credit Transfers</h3> :
                                        <h3>Credit Transfer Information</h3>
                                    }
                                </div>
                            </div>
                        </a>
                        <div
                          id="collapseAccountAccountLedgers"
                          className="panel-collapse collapse row"
                          role="tabpanel"
                          aria-labelledby="#headingAccountAccountLedgers"
                        >
                            <div className="panel-body">
                                {ledgersList}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="row section-heading" role="tab" id="headingAccountAccountLedgers">
                        <h3>Credit Transfers - None</h3>
                    </div>
                )}
            </div>
        );
    }
}

AccountLedgersMiniSummary.propTypes = {
    currentUser: PropTypes.object,
    mapSet: PropTypes.object,
    mapQualifier: PropTypes.string,
    singleAccountLedger: PropTypes.bool,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
    };
}

export default connect(mapStateToProps)(AccountLedgersMiniSummary);
