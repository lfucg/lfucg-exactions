import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
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
import LoadingScreen from './LoadingScreen';

import {
    formUpdate,
} from '../actions/formActions';

import {
    getAgreementID,
    getAccountID,
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

        return (
            <div className="agreement-summary">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>AGREEMENT SUMMARY - {!!agreements && !!agreements.currentAgreement && agreements.currentAgreement.resolution_number}</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'agreement'} parent_name={'Agreements'} />

                <div className="inside-body">
                    {agreements.loadingAgreement ? <LoadingScreen /> :
                    (
                        <div className="container">
                            {agreements.currentAgreement &&
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
                                                        <Link to={`agreement/form/${agreements.currentAgreement.id}`} aria-label={`Edit ${agreements.currentAgreement.resolution_number}`}>
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
                                            <p className="col-xs-6">Resolution Number: {agreements.currentAgreement.resolution_number}</p>
                                            <p className="col-xs-6">Current Balance: {agreements.currentAgreement.agreement_balance && agreements.currentAgreement.agreement_balance.total}</p>
                                            <p className="col-xs-6">Agreement Type: {agreements.currentAgreement.agreement_type_display}</p>
                                            <p className="col-xs-6">Expansion Area: {agreements.currentAgreement.expansion_area}</p>
                                            <p className="col-xs-6">Date Executed: {agreements.currentAgreement.date_executed}</p>
                                        </div>
                                    </div>
                                </div>
                                {agreements && agreements.currentAgreement.id &&
                                    <Notes
                                      content_type="accounts_agreement"
                                      object_id={agreements.currentAgreement.id}
                                      ariaExpanded="false"
                                      panelClass="panel-collapse collapse row"
                                      permission="agreement"
                                    />
                                }

                                <AccountsMiniSummary
                                  mapSet={accounts && accounts.currentAccount}
                                  mapQualifier={!!accounts && !!accounts.currentAccount && !!accounts.currentAccount.id}
                                  singleAccount
                                  title="Developer Account"
                                  accordionID="Account"
                                />

                                <PaymentsMiniSummary
                                  mapSet={payments && payments.payments}
                                  mapQualifier={payments && payments.payments && payments.payments.length > 0}
                                  payments={payments}
                                />

                                <ProjectsMiniSummary
                                  mapSet={projects && projects.projects}
                                  mapQualifier={projects && projects.projects && projects.projects.length > 0}
                                  projects={projects}
                                />

                                <AccountLedgersMiniSummary
                                  mapSet={accountLedgers.accountLedgers}
                                  mapQualifier={accountLedgers && accountLedgers.accountLedgers && accountLedgers.accountLedgers.length > 0}
                                  accountLedgers={accountLedgers}
                                />

                                {agreements && agreements.currentAgreement.id &&
                                    <Uploads
                                      file_content_type="accounts_agreement"
                                      file_object_id={agreements.currentAgreement.id}
                                      ariaExpanded="false"
                                      panelClass="panel-collapse collapse row"
                                      permission="agreement"
                                    />
                                }
                            </div>
                            }
                        </div>
                    )}
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
        accountLedgers: state.accountLedgers,
        agreements: state.agreements,
        payments: state.payments,
        projects: state.projects,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedAgreement = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(getAgreementPayments(selectedAgreement));
            dispatch(getAgreementProjects(selectedAgreement));
            dispatch(getAgreementAccountLedgers(selectedAgreement))
            .then(() => {
                dispatch(formUpdate({ loading: false }));
            });
            dispatch(getAgreementID(selectedAgreement))
            .then((agreement) => {
                dispatch(getAccountID(agreement.response.account_id.id));
            });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AgreementSummary);

