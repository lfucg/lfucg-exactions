import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

import {
    getAgreementID,
    getAgreementPayments,
    getAgreementProjects,
    getAgreementAccountLedgers,
} from '../actions/apiActions';

class AgreementSummary extends React.Component {
    static propTypes = {
        currentUser: React.PropTypes.object,
        agreements: React.PropTypes.object,
        payments: React.PropTypes.object,
        projects: React.PropTypes.object,
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
            agreements,
            payments,
            projects,
            accountLedgers,
        } = this.props;

        const payments_list = (payments && payments.length > 0) ? (
            map((payment) => {
                return (
                    <div key={payment.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <div className="col-sm-7 col-md-9">
                                <h3>Account: {payment.credit_account.account_name}</h3>
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
                            <p className="col-md-3 col-sm-4 col-xs-6">Paid By: {payment.paid_by}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Total Paid: {payment.total_paid}</p>
                            <p className="col-xs-12">Lot: {payment.lot_id.address_full}</p>
                        </div>
                    </div>
                );
            })(payments)
        ) : null;

        const projects_list = (projects && projects.length > 0) ? (
            map((project) => {
                return (
                    <div key={project.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <div className="col-sm-7 col-md-9">
                                <h3>{project.project_category}</h3>
                            </div>
                            <div className="col-sm-5 col-md-3">
                                <div className="col-xs-5">
                                    {currentUser && currentUser.permissions && currentUser.permissions.project &&
                                        <Link to={`project/form/${project.id}`} className="btn btn-mid-level">
                                            Edit
                                        </Link>
                                    }
                                </div>
                                <div className="col-xs-5 col-xs-offset-1">
                                    <Link to={`project/summary/${project.id}`} className="btn btn-mid-level">
                                        Summary
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <p className="col-sm-4 col-xs-6">Expansion Area: {project.expansion_area}</p>
                            <p className="col-sm-4 col-xs-6">Project Type: {project.project_type_display}</p>
                            <p className="col-sm-4 col-xs-6">Project Status: {project.project_status_display}</p>
                            <p className="col-sm-4 col-xs-6">Status Date: {project.status_date}</p>
                            <p className="col-sm-4 col-xs-6">Project Description: {project.project_description}</p>
                        </div>
                    </div>
                );
            })(projects)
        ) : null;

        const account_ledgers_list = (accountLedgers && accountLedgers.length > 0) ? (
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
                            { accountLedger.account_from &&
                                <p className="col-md-3 col-sm-4 col-xs-6">Account From: {accountLedger.account_from.account_name}</p>
                            }
                            { accountLedger.account_to &&
                                <p className="col-md-3 col-sm-4 col-xs-6">Account To: {accountLedger.account_to.account_name}</p>
                            }
                            { accountLedger.lot &&
                                <p className="col-xs-12">Lot: {accountLedger.lot.address_full}</p>
                            }
                        </div>
                    </div>
                );
            })(accountLedgers)
        ) : null;

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
                                    <div className="col-xs-12">
                                        <p className="col-md-4 col-xs-6">Resolution Number: {agreements.resolution_number}</p>
                                        <p className="col-md-4 col-xs-6">Expansion Area: {agreements.expansion_area}</p>
                                        <p className="col-md-4 col-xs-6">Agreement Type: {agreements.agreement_type_display}</p>
                                        <p className="col-md-4 col-xs-6">Date Executed: {agreements.date_executed}</p>
                                    </div>
                                    {currentUser && currentUser.permissions && currentUser.permissions.agreement &&
                                        <div className="col-md-offset-11 col-sm-offset-10 col-xs-offset-8">
                                            <Link to={`agreement/form/${agreements.id}`} role="link" >
                                                <h4>Edit</h4>
                                            </Link>
                                        </div>
                                    }
                                </div>
                            </div>

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
                                                <h4 className="col-md-4 col-xs-6">Account Name: {agreements.account_id.account_name}</h4>
                                                <h4 className="col-md-4 col-xs-6">Contact Name: {agreements.account_id.contact_full_name}</h4>
                                                <h4 className="col-xs-12">Address: {agreements.account_id.address_full}</h4>
                                                <h4 className="col-md-4 col-xs-6 ">Phone: {agreements.account_id.phone}</h4>
                                                <h4 className="col-md-4 col-xs-6">Email: {agreements.account_id.email}</h4>
                                            </div>
                                            <div className="col-md-offset-8 col-sm-offset-6">
                                                <div className="col-xs-6">
                                                    {currentUser && currentUser.permissions && currentUser.permissions.account &&
                                                        <Link to={`account/form/${agreements.account_id.id}`} role="link" >
                                                            <h4>Edit</h4>
                                                        </Link>
                                                    }
                                                </div>
                                                <div className="col-xs-6">
                                                    <Link to={`account/summary/${agreements.account_id.id}`} role="link" >
                                                        <h4>Summary</h4>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> : <div className="row section-heading" role="tab" id="headingAccountProjects">
                                    <h2>Account - None</h2>
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
            dispatch(getAgreementID(selectedAgreement));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AgreementSummary);

