import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { map } from 'ramda';
import PropTypes from 'prop-types';

class PaymentsMiniSummary extends React.Component {
    render() {
        const {
            currentUser,
        } = this.props;

        const paymentsList = this.props.mapQualifier && this.props.singlePayment ?
            (<div>
                <div className="row link-row">
                    <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                        <div className="col-xs-5">
                            {currentUser && currentUser.permissions && currentUser.permissions.payment &&
                                <Link to={`payment/form/${this.props.mapSet.id}`} aria-label={`Edit ${this.props.mapSet.lot_id && this.props.mapSet.lot_id.address_full}`}>
                                    <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                    <div className="col-xs-7 link-label">
                                        Edit
                                    </div>
                                </Link>
                            }
                        </div>
                        <div className="col-xs-5 ">
                            <Link to={`payment/summary/${this.props.mapSet.id}`} aria-label={`${this.props.mapSet.lot_id && this.props.mapSet.lot_id.address_full} Summary`}>
                                <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                <div className="col-xs-7 link-label">
                                    Summary
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-xs-12">
                    <h3 className="col-xs-12">Payment Total: {this.props.mapSet.total_paid}</h3>
                    <p className="col-xs-6">Paid Sewer: ${(parseFloat(this.props.mapSet.paid_sewer_cap) + parseFloat(this.props.mapSet.paid_sewer_trans)).toLocaleString('en')}</p>
                    <p className="col-xs-6">Paid Non-Sewer: ${(parseFloat(this.props.mapSet.paid_open_space) + parseFloat(this.props.mapSet.paid_parks) + parseFloat(this.props.mapSet.paid_roads) + parseFloat(this.props.mapSet.paid_storm)).toLocaleString('en')}</p>
                    <p className="col-xs-6">Paid By: {this.props.mapSet.paid_by} ({this.props.mapSet.paid_by_type_display})</p>
                    <p className="col-xs-6">Payment Type: {this.props.mapSet.this.props.mapSet_type_display} {this.props.mapSet.check_number ? `(#${this.props.mapSet.check_number})` : null}</p>
                    <p className="col-xs-6">Developer Account: {this.props.mapSet.credit_account.account_name}</p>
                    <p className="col-xs-6">Agreement Resolution: {this.props.mapSet.credit_source && this.props.mapSet.credit_source.resolution_number}</p>
                    <p className="col-xs-12">Lot: {this.props.mapSet.lot_id.address_full}</p>
                </div>
            </div>) : (
                this.props.mapQualifier && map((payment) => {
                    return (
                        <div key={payment.id} className="col-xs-12">
                            <div className="row form-subheading">
                                <h3>{payment.lot_id && payment.lot_id.address_full}</h3>
                            </div>
                            <div className="row link-row">
                                <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                                    <div className="col-xs-5">
                                        {currentUser && currentUser.permissions && currentUser.permissions.payment &&
                                            <Link to={`payment/form/${payment.id}`} aria-label={`Edit ${payment.lot_id && payment.lot_id.address_full}`}>
                                                <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                <div className="col-xs-7 link-label">
                                                    Edit
                                                </div>
                                            </Link>
                                        }
                                    </div>
                                    <div className="col-xs-5 ">
                                        <Link to={`payment/summary/${payment.id}`} aria-label={`${payment.lot_id && payment.lot_id.address_full} Summary`}>
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
                                <p className="col-xs-6">Paid By: {payment.paid_by} ({payment.paid_by_type_display})</p>
                                <p className="col-xs-6">Payment Type: {payment.payment_type_display} {payment.check_number ? `(#${payment.check_number})` : null}</p>
                                <p className="col-xs-6">Developer Account: {payment.credit_account.account_name}</p>
                                <p className="col-xs-6">Agreement Resolution: {payment.credit_source && payment.credit_source.resolution_number}</p>
                                <p className="col-xs-12">Lot: {payment.lot_id.address_full}</p>
                            </div>
                        </div>
                    );
                })(this.props.mapSet)
            )
        ;

        return (
            <div className="existing-page-links">
                {paymentsList ? (
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
                                    {!this.props.singlePayment ?
                                        <h3>Payments</h3> :
                                        <h3>Payment Information</h3>
                                    }
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
                                {paymentsList}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="row section-heading" role="tab" id="headingAccountPayments">
                        <h3 tabIndex="0">Payments - {!!this.props.mapSet ? 'None' : <i className="fa fa-spinner fa-pulse fa-fw" />}</h3>
                    </div>
                )}
            </div>
        );
    }
}

PaymentsMiniSummary.propTypes = {
    currentUser: PropTypes.object,
    mapSet: PropTypes.object,
    mapQualifier: PropTypes.object,
    singlePayment: PropTypes.bool,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
    };
}

export default connect(mapStateToProps)(PaymentsMiniSummary);
