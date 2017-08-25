import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

import {
    getAccountID,
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
            accounts,
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
                            <h3>Paid By {payment.paid_by}</h3>
                        </div>
                        <div className="row link-row">
                            <div className="col-xs-12 col-sm-5 col-md-3 col-sm-offset-7 col-md-offset-9">
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
                            <p className="col-md-3 col-sm-4 col-xs-6">Total Paid: {payment.total_paid}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Payment Type: {payment.payment_type}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Paid By Type: {payment.paid_by_type}</p>
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
                            <h3>{project.project_category}</h3>
                        </div>
                        <div className="row link-row">
                            <div className="col-xs-12 col-sm-5 col-md-3 col-sm-offset-7 col-md-offset-9">
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
                            <p className="col-md-3 col-sm-4 col-xs-6">Expansion Area: {project.expansion_area}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Project Type: {project.project_type_display}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Project Status: {project.project_status_display}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Status Date: {project.status_date}</p>
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
                            <div className="col-xs-12 col-sm-5 col-md-3 col-sm-offset-7 col-md-offset-9">
                                <div className="col-xs-5">
                                    {currentUser && currentUser.permissions && currentUser.permissions.accountledger &&
                                        <Link to={`account-ledger/form/${accountLedger.id}`} aria-label="Edit">
                                            <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                            <div className="col-xs-7 link-label">
                                                Edit
                                            </div>
                                        </Link>
                                    }
                                </div>
                                <div className="col-xs-5 ">
                                    <Link to={`account-ledger/summary/${accountLedger.id}`} aria-label="Summary">
                                        <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                        <div className="col-xs-7 link-label">
                                            Summary
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <p className="col-md-3 col-sm-4 col-xs-6">Entry Type: {accountLedger.entry_type}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Non-Sewer Credits: {accountLedger.non_sewer_credits}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Sewer Credits: {accountLedger.sewer_credits}</p>
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
                                        <h2>Agreement Information</h2>
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

                            {accounts && accounts.id ? (
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
                                                <h2>Developer Account Information</h2>
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
                                                <div className="col-xs-12 col-sm-5 col-md-3 col-sm-offset-7 col-md-offset-9">
                                                    <div className="col-xs-5">
                                                        {currentUser && currentUser.permissions && currentUser.permissions.account &&
                                                            <Link to={`account/form/${accounts.id}`} aria-label="Edit">
                                                                <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                                <div className="col-xs-7 link-label">
                                                                    Edit
                                                                </div>
                                                            </Link>
                                                        }
                                                    </div>
                                                    <div className="col-xs-5 ">
                                                        <Link to={`account/summary/${accounts.id}`} aria-label="Summary">
                                                            <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                                            <div className="col-xs-7 link-label">
                                                                Summary
                                                            </div>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xs-12">
                                                <h4 className="col-md-4 col-xs-6">Developer Account Name: {accounts.account_name}</h4>
                                                {currentUser && currentUser.username &&
                                                    <div>
                                                        <h4 className="col-md-4 col-xs-6">Contact Name: {accounts.contact_full_name}</h4>
                                                        <h4 className="col-xs-12">Address: {accounts.address_full}</h4>
                                                        <h4 className="col-md-4 col-xs-6 ">Phone: {accounts.phone}</h4>
                                                        <h4 className="col-md-4 col-xs-6">Email: {accounts.email}</h4>
                                                    </div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="row section-heading" role="tab" id="headingAccountInfo">
                                    <h2>Developer Account - None</h2>
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
                                                <h2>Payments</h2>
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
                                    <h2>Payments - None</h2>
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
                                                <h2>Projects</h2>
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
                                    <h2>Projects - None</h2>
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
                                                {account_ledgers_list}
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

AgreementSummary.propTypes = {
    currentUser: PropTypes.object,
    accounts: PropTypes.object,
    agreements: PropTypes.object,
    payments: PropTypes.object,
    projects: PropTypes.object,
    accountLedgers: PropTypes.object,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        accounts: state.accounts,
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
            dispatch(getAgreementID(selectedAgreement))
            .then((data_agreement) => {
                if (data_agreement.response.account_id) {
                    dispatch(getAccountID(data_agreement.response.account_id));
                }
            });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AgreementSummary);

