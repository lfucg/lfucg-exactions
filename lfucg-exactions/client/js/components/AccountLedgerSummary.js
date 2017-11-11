import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Notes from './Notes';

import LotsMiniSummary from './LotsMiniSummary';
import AccountsMiniSummary from './AccountsMiniSummary';
import AgreementsMiniSummary from './AgreementsMiniSummary';

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
                                        <div className="col-xs-12 col-sm-5 col-sm-offset-7">
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

                            <LotsMiniSummary
                              mapSet={accountLedgers.lot}
                              mapQualifier={accountLedgers && accountLedgers.lot && accountLedgers.lot.id}
                              singleLot={true}
                            />

                            <AccountsMiniSummary
                              mapSet={accountLedgers.account_from}
                              mapQualifier={accountLedgers && accountLedgers.account_from && accountLedgers.account_from.id}
                              singleAccount={true}
                              title="Developer Account From"
                              accordionID="AccountFrom"
                            />

                            <AccountsMiniSummary
                              mapSet={accountLedgers.account_to}
                              mapQualifier={accountLedgers && accountLedgers.account_to && accountLedgers.account_to.id}
                              singleAccount={true}
                              title="Developer Account To"
                              accordionID="AccountTo"
                            />

                            <AgreementsMiniSummary
                              mapSet={accountLedgers.agreement}
                              mapQualifier={accountLedgers && accountLedgers.agreement && accountLedgers.agreement.id}
                              singleAgreement={true}
                            />

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

