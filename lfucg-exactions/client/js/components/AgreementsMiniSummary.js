import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { map } from 'ramda';
import PropTypes from 'prop-types';

class AgreementsMiniSummary extends React.Component {
    render() {
        const {
            currentUser,
        } = this.props;

        const agreementsList = this.props.mapQualifier && this.props.singleAgreement ?
            (<div>
                <div className="row link-row">
                    <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                        <div className="col-xs-5">
                            {currentUser && currentUser.permissions && currentUser.permissions.agreement &&
                                <Link to={`agreement/form/${this.props.mapSet.id}`} aria-label={`Edit ${this.props.mapSet.resolution_number}`}>
                                    <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                    <div className="col-xs-7 link-label">
                                        Edit
                                    </div>
                                </Link>
                            }
                        </div>
                        <div className="col-xs-5 ">
                            <Link to={`agreement/summary/${this.props.mapSet.id}`} aria-label={`${this.props.mapSet.resolution_number} Summary`}>
                                <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                <div className="col-xs-7 link-label">
                                    Summary
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-xs-12">
                    <p className="col-xs-6">Current Balance: {this.props.mapSet.agreement_balance && this.props.mapSet.agreement_balance.total}</p>
                    <p className="col-xs-6">Resolution Number: {this.props.mapSet.resolution_number}</p>
                    <p className="col-xs-6">Expansion Area: {this.props.mapSet.expansion_area}</p>
                    <p className="col-xs-6">Agreement Type: {this.props.mapSet.agreement_type_display}</p>
                    <p className="col-xs-6">Date Executed: {this.props.mapSet.date_executed}</p>
                </div>
            </div>) : (
                this.props.mapQualifier && map((agreement) => {
                    return (
                        <div key={agreement.id} className="col-xs-12">
                            <div className="row form-subheading">
                                <h3>{agreement.resolution_number}</h3>
                            </div>
                            <div className="row link-row">
                                <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                                    <div className="col-xs-5">
                                        {currentUser && currentUser.permissions && currentUser.permissions.agreement &&
                                            <Link to={`agreement/form/${agreement.id}`} aria-label={`Edit ${agreement.resolution_number}`}>
                                                <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                <div className="col-xs-7 link-label">
                                                    Edit
                                                </div>
                                            </Link>
                                        }
                                    </div>
                                    <div className="col-xs-5 ">
                                        <Link to={`agreement/summary/${agreement.id}`} aria-label={`${agreement.resolution_number} Summary`}>
                                            <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                            <div className="col-xs-7 link-label">
                                                Summary
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <p className="col-xs-6">Current Balance: {agreement.agreement_balance && agreement.agreement_balance.total}</p>
                                <p className="col-xs-6">Agreement Type: {agreement.agreement_type_display}</p>
                                <p className="col-xs-6">Date Executed: {agreement.date_executed}</p>
                                <p className="col-xs-6">Expansion Area: {agreement.expansion_area}</p>
                            </div>
                        </div>
                    );
                })(this.props.mapSet)
            )
        ;

        return (
            <div className="existing-page-links">
                {agreementsList ? (
                    <div>
                        <a
                          role="button"
                          data-toggle="collapse"
                          data-parent="#accordion"
                          href="#collapseAccountAgreements"
                          aria-expanded="false"
                          aria-controls="collapseAccountAgreements"
                        >
                            <div className="row section-heading" role="tab" id="headingAccountAgreements">
                                <div className="col-xs-1 caret-indicator" />
                                <div className="col-xs-10">
                                    {!this.props.singleAgreement ?
                                        <h3>Agreements</h3> :
                                        <h3>Agreement Information</h3>
                                    }
                                </div>
                            </div>
                        </a>
                        <div
                          id="collapseAccountAgreements"
                          className="panel-collapse collapse row"
                          role="tabpanel"
                          aria-labelledby="#headingAccountAgreements"
                        >
                            <div className="panel-body">
                                {agreementsList}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="row section-heading" role="tab" id="headingAccountAgreements">
                        <h3>Agreements - None</h3>
                    </div>
                )}
            </div>
        );
    }
}

AgreementsMiniSummary.propTypes = {
    currentUser: PropTypes.object,
    mapSet: PropTypes.object,
    mapQualifier: PropTypes.string,
    singleAgreement: PropTypes.bool,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
    };
}

export default connect(mapStateToProps)(AgreementsMiniSummary);
