import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Uploads from './Uploads';
import Notes from './Notes';

import AccountsMiniSummary from './AccountsMiniSummary';
import AccountLedgersMiniSummary from './AccountLedgersMiniSummary';
import PaymentsMiniSummary from './PaymentsMiniSummary';
import ProjectsMiniSummary from './ProjectsMiniSummary';

import {
    getAgreementID,
    getAgreementPayments,
    getAgreementProjects,
    getAgreementAccountLedgers,
} from '../actions/apiActions';

class AgreementSummary extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            currentUser,
            agreements,
            payments,
            projects,
            accountLedgers,
        } = this.props;

        return (
            <div className="agreement-summary">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>AGREEMENT SUMMARY - {agreements.resolution_number}</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'agreement'} parent_name={'Agreements'} />

                <div className="inside-body">
                    <div className="container">
                        <div className="col-md-offset-1 col-md-10 panel-group" id="accordion" role="tablist" aria-multiselectable="false">
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
                                        <h3>Agreement Information</h3>
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
                                        <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                                            <div className="col-xs-5">
                                                {currentUser && currentUser.permissions && currentUser.permissions.agreement &&
                                                    <Link to={`agreement/form/${agreements.id}`} aria-label={`Edit ${agreements.resolution_number}`}>
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
                                        <p className="col-xs-6">Resolution Number: {agreements.resolution_number}</p>
                                        <p className="col-xs-6">Current Balance: {agreements.agreement_balance && agreements.agreement_balance.total}</p>
                                        <p className="col-xs-6">Agreement Type: {agreements.agreement_type_display}</p>
                                        <p className="col-xs-6">Expansion Area: {agreements.expansion_area}</p>
                                        <p className="col-xs-6">Date Executed: {agreements.date_executed}</p>
                                    </div>
                                </div>
                            </div>
                            {agreements && agreements.id &&
                                <Notes
                                  content_type="accounts_agreement"
                                  object_id={agreements.id}
                                  ariaExpanded="false"
                                  panelClass="panel-collapse collapse row"
                                  permission="agreement"
                                />
                            }

                            <AccountsMiniSummary
                              mapSet={agreements.account_id}
                              mapQualifier={agreements && agreements.account_id && agreements.account_id.id}
                              singleAccount={true}
                              title="Developer Account"
                              accordionID="Account"
                            />

                            <PaymentsMiniSummary
                              mapSet={payments}
                              mapQualifier={payments && payments.length > 0}
                            />

                            <ProjectsMiniSummary
                              mapSet={projects}
                              mapQualifier={projects && projects.length > 0}
                            />

                            <AccountLedgersMiniSummary
                              mapSet={accountLedgers}
                              mapQualifier={accountLedgers && accountLedgers.length > 0}
                            />

                            {agreements && agreements.id &&
                                <Uploads
                                  file_content_type="accounts_agreement"
                                  file_object_id={agreements.id}
                                  ariaExpanded="false"
                                  panelClass="panel-collapse collapse row"
                                  permission="agreement"
                                />
                            }
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

AgreementSummary.propTypes = {
    currentUser: PropTypes.object,
    agreements: PropTypes.array,
    payments: PropTypes.array,
    projects: PropTypes.array,
    accountLedgers: PropTypes.array,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        agreements: state.agreements,
        payments: state.payments,
        projects: state.projects,
        accountLedgers: state.accountLedgers,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedAgreement = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(getAgreementPayments(selectedAgreement));
            dispatch(getAgreementProjects(selectedAgreement));
            dispatch(getAgreementAccountLedgers(selectedAgreement));
            dispatch(getAgreementID(selectedAgreement));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AgreementSummary);

