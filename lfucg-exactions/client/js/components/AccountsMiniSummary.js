import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { map } from 'ramda';
import PropTypes from 'prop-types';

class AccountsMiniSummary extends React.Component {
    render() {
        const {
            currentUser,
        } = this.props;

        const accountsList = this.props.mapQualifier && this.props.singleAccount ?
            (<div>
                <div className="row link-row">
                    <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                        <div className="col-xs-5">
                            {currentUser && currentUser.permissions && currentUser.permissions.account &&
                                <Link to={`account/form/${this.props.mapSet.id}`} aria-label={`Edit ${this.props.mapSet.account_name}`}>
                                    <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                    <div className="col-xs-7 link-label">
                                        Edit
                                    </div>
                                </Link>
                            }
                        </div>
                        <div className="col-xs-5 ">
                            <Link to={`account/summary/${this.props.mapSet.id}`} aria-label={`${this.props.mapSet.account_name} Summary`}>
                                <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                <div className="col-xs-7 link-label">
                                    Summary
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-xs-12">
                    <p className="col-xs-6">Developer Account Name: {this.props.mapSet.account_name}</p>
                    <p className="col-xs-6"><strong>{this.props.mapSet.balance && this.props.mapSet.balance.credit_availability}</strong></p>
                    {currentUser && currentUser.username &&
                        <div>
                            <p className="col-xs-6">Contact Name: {this.props.mapSet.contact_full_name}</p>
                            <p className="col-xs-6">Account Balance: {this.props.mapSet.balance && this.props.mapSet.balance.balance}</p>
                            <p className="col-xs-6 ">Phone: {this.props.mapSet.phone}</p>
                            <p className="col-xs-6">Email: {this.props.mapSet.email}</p>
                            <p className="col-xs-12">Address: {this.props.mapSet.address_full}</p>
                        </div>
                    }
                </div>
            </div>) : (
                this.props.mapQualifier && map((account) => {
                    return (
                        <div key={account.id} className="col-xs-12">
                            <div className="row form-subheading">
                                <h3>{account.account_name}</h3>
                            </div>
                            <div className="row link-row">
                                <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                                    <div className="col-xs-5">
                                        {currentUser && currentUser.permissions && currentUser.permissions.account &&
                                            <Link to={`account/form/${account.id}`} aria-label="Edit">
                                                <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                <div className="col-xs-7 link-label">
                                                    Edit
                                                </div>
                                            </Link>
                                        }
                                    </div>
                                    <div className="col-xs-5 ">
                                        <Link to={`account/summary/${account.id}`} aria-label="Summary">
                                            <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                            <div className="col-xs-7 link-label">
                                                Summary
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <p className="col-xs-6">Developer Account Name: {account.account_name}</p>
                                <p className="col-xs-6"><strong>{account.balance && account.balance.credit_availability}</strong></p>
                                {currentUser && currentUser.username &&
                                    <div>
                                        <p className="col-xs-6">Contact Name: {account.contact_full_name}</p>
                                        <p className="col-xs-6">Account Balance: {account.balance && account.balance.balance}</p>
                                        <p className="col-xs-6 ">Phone: {account.phone}</p>
                                        <p className="col-xs-6">Email: {account.email}</p>
                                        <p className="col-xs-12">Address: {account.address_full}</p>
                                    </div>
                                }
                            </div>
                        </div>
                    );
                })(this.props.mapSet)
            )
        ;

        return (
            <div className="existing-page-links">
                {accountsList ? (
                    <div>
                        <a
                          role="button"
                          data-toggle="collapse"
                          data-parent="#accordion"
                          href={`#collapse${this.props.accordionID}`}
                          aria-expanded="false"
                          aria-controls="collapseAccountAccounts"
                        >
                            <div className="row section-heading" role="tab" id="headingAccountAccounts">
                                <div className="col-xs-1 caret-indicator" />
                                <div className="col-xs-10">
                                    {!this.props.singleAccount ?
                                        <h3>{this.props.title}</h3> :
                                        <h3>{this.props.title} Information</h3>
                                    }
                                </div>
                            </div>
                        </a>
                        <div
                          id={`collapse${this.props.accordionID}`}
                          className="panel-collapse collapse row"
                          role="tabpanel"
                          aria-labelledby="#headingAccountAccounts"
                        >
                            <div className="panel-body">
                                {accountsList}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="row section-heading" role="tab" id="headingAccountAccounts">
                        <h3>Accounts - None</h3>
                    </div>
                )}
            </div>
        );
    }
}

AccountsMiniSummary.propTypes = {
    currentUser: PropTypes.object,
    mapSet: PropTypes.object,
    mapQualifier: PropTypes.string,
    singleAccount: PropTypes.bool,
    title: PropTypes.string,
    accordionID: PropTypes.string,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
    };
}

export default connect(mapStateToProps)(AccountsMiniSummary);
