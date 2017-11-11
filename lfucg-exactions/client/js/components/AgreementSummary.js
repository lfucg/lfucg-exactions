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

        const projects_list = projects && projects.length > 0 &&
            map((project) => {
                return (
                    <div key={project.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <h3>{project.name}</h3>
                        </div>
                        <div className="row link-row">
                            <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                                <div className="col-xs-5">
                                    {currentUser && currentUser.permissions && currentUser.permissions.project &&
                                        <Link to={`project/form/${project.id}`} aria-label="Edit">
                                            <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                            <div className="col-xs-7 link-label">
                                                Edit
                                            </div>
                                        </Link>
                                    }
                                </div>
                                <div className="col-xs-5 ">
                                    <Link to={`project/summary/${project.id}`} aria-label="Summary">
                                        <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                        <div className="col-xs-7 link-label">
                                            Summary
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <p className="col-sm-4 col-xs-6">Project Category: {project.project_category}</p>
                            <p className="col-sm-4 col-xs-6">Expansion Area: {project.expansion_area}</p>
                            <p className="col-sm-4 col-xs-6">Project Type: {project.project_type_display}</p>
                            <p className="col-sm-4 col-xs-6">Project Status: {project.project_status_display}</p>
                            <p className="col-sm-4 col-xs-6">Status Date: {project.status_date}</p>
                            <p className="col-xs-12">Project Description: {project.project_description}</p>
                        </div>
                    </div>
                );
            })(projects);

        return (
            <div className="agreement-summary">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>AGREEMENT - SUMMARY</h1>
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
                                                    <Link to={`agreement/form/${agreements.id}`} aria-label="Edit">
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

                            {projects_list ? (
                                <div>
                                    <a
                                      role="button"
                                      data-toggle="collapse"
                                      data-parent="#accordion"
                                      href="#collapseAccountProjects"
                                      aria-expanded="false"
                                      aria-controls="collapseAccountProjects"
                                    >
                                        <div className="row section-heading" role="tab" id="headingAccountProjects">
                                            <div className="col-xs-1 caret-indicator" />
                                            <div className="col-xs-10">
                                                <h3>Projects</h3>
                                            </div>
                                        </div>
                                    </a>
                                    <div
                                      id="collapseAccountProjects"
                                      className="panel-collapse collapse row"
                                      role="tabpanel"
                                      aria-labelledby="#headingAccountProjects"
                                    >
                                        <div className="panel-body">
                                            <div className="col-xs-12">
                                                {projects_list}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="row section-heading" role="tab" id="headingAccountProjects">
                                    <h3>Projects - None</h3>
                                </div>
                            )}

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

