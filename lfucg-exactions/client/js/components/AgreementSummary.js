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

        const payments_list = payments && payments.length > 0 &&
            map((payment) => {
                return (
                    <div key={payment.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <h3>Account: {payment.credit_account.account_name}</h3>
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
                            <p className="col-xs-6">Agreement Resolution: {payment.credit_source && payment.credit_source.resolution_number}</p>
                            <p className="col-xs-6">Payment Type: {payment.payment_type_display} {payment.check_number ? `(#${payment.check_number})` : null}</p>
                            <p className="col-xs-12">Lot: {payment.lot_id.address_full}</p>
                        </div>
                    </div>
                );
            })(payments);

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

        const account_ledgers_list = accountLedgers && accountLedgers.length > 0 &&
            map((accountLedger) => {
                return (
                    <div key={accountLedger.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <h3>{accountLedger.entry_date}</h3>
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
                            { accountLedger.lot ? (
                                <div>
                                    <p className="col-xs-6">Entry Type: {accountLedger.entry_type_display}</p>
                                    <p className="col-xs-6">Lot: {accountLedger.lot.address_full}</p>
                                </div>
                                ) : (<p className="col-xs-12">Entry Type: {accountLedger.entry_type_display}</p>)
                            }

                            { accountLedger.account_from &&
                                <p className="col-xs-6">Account From: {accountLedger.account_from.account_name}</p>
                            }
                            <p className="col-xs-6">Non-Sewer Credits: {accountLedger.non_sewer_credits}</p>
                            { accountLedger.account_to &&
                                <p className="col-xs-6">Account To: {accountLedger.account_to.account_name}</p>
                            }
                            <p className="col-xs-6">Sewer Credits: {accountLedger.sewer_credits}</p>
                        </div>
                    </div>
                );
            })(accountLedgers);

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

                            {agreements && agreements.account_id && agreements.account_id.id ?
                                <div>
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
                                                    <div className="col-xs-5">
                                                        {currentUser && currentUser.permissions && currentUser.permissions.account &&
                                                            <Link to={`account/form/${agreements.account_id.id}`} aria-label="Edit">
                                                                <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                                <div className="col-xs-7 link-label">
                                                                    Edit
                                                                </div>
                                                            </Link>
                                                        }
                                                    </div>
                                                    <div className="col-xs-5 ">
                                                        <Link to={`account/summary/${agreements.account_id.id}`} aria-label="Summary">
                                                            <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                                            <div className="col-xs-7 link-label">
                                                                Summary
                                                            </div>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xs-12">
                                                <p className="col-xs-6">Developer Account Name: {agreements.account_id.account_name}</p>
                                                <p className="col-xs-6"><strong>{agreements.account_id.balance && agreements.account_id.balance.credit_availability}</strong></p>
                                                {currentUser && currentUser.username &&
                                                    <div>
                                                        <p className="col-xs-6">Contact Name: {agreements.account_id.contact_full_name}</p>
                                                        <p className="col-xs-6">Account Balance: {agreements.account_id.balance && agreements.account_id.balance.balance}</p>
                                                        <p className="col-xs-6 ">Phone: {agreements.account_id.phone}</p>
                                                        <p className="col-xs-6">Email: {agreements.account_id.email}</p>
                                                        <p className="col-xs-12">Address: {agreements.account_id.address_full}</p>
                                                    </div>}
                                            </div>
                                        </div>
                                    </div>
                                </div> : <div className="row section-heading" role="tab" id="headingAccountInfo">
                                    <h3>Developer Account - None</h3>
                                </div>
                            }

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

                            {account_ledgers_list ? (
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
                                                {account_ledgers_list}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="row section-heading" role="tab" id="headingAccountLedgers">
                                    <h3>Credit Transfers - None</h3>
                                </div>
                            )}

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

