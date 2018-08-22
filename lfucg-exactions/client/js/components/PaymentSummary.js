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
import LoadingScreen from './LoadingScreen';

import {
    formUpdate,
} from '../actions/formActions';

import {
    getPaymentID,
} from '../actions/apiActions';

class PaymentSummary extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            currentUser,
            payments,
            activeForm,
        } = this.props;

        return (
            <div className="payment-summary">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>PAYMENT SUMMARY - {payments.payments.paid_by}</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'payment'} parent_name={'Payments'} />

                <div className="inside-body">
                    <div className="container">
                        {payments.loadingPayment ? <LoadingScreen /> :
                        (
                          <div className="col-md-offset-1 col-md-10 panel-group" id="accordion" role="tablist" aria-multiselectable="false">
                            {!!payments && !!payments.currentPayment && 
                                <div>
                                    <a
                                        role="button"
                                        data-toggle="collapse"
                                        data-parent="#accordion"
                                        href="#collapsePaymentInfo"
                                        aria-expanded="false"
                                        aria-controls="collapsePaymentInfo"
                                    >
                                        <div className="row section-heading" role="tab" id="headingPaymentInfo">
                                            <div className="col-xs-1 caret-indicator" />
                                            <div className="col-xs-10">
                                                <h3>Payment Information</h3>
                                            </div>
                                        </div>
                                    </a>
                                    <div
                                        id="collapsePaymentInfo"
                                        className="panel-collapse collapse row"
                                        role="tabpanel"
                                        aria-labelledby="#headingPaymentInfo"
                                    >
                                        <div className="panel-body">
                                            <div className="row link-row">
                                                <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                                                    <div className="col-xs-5 col-xs-offset-5">
                                                        {currentUser && currentUser.permissions && currentUser.permissions.payment &&
                                                            <Link to={`payment/form/${payments.currentPayment.id}`} aria-label={`Edit ${payments.currentPayment.paid_by}`}>
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
                                                <p className="col-xs-6">Paid By: {payments.currentPayment.paid_by}</p>
                                                <p className="col-xs-6">Paid By Type: {payments.currentPayment.paid_by_type_display}</p>
                                                <p className="col-xs-6">Total Paid: {payments.currentPayment.total_paid}</p>
                                                <p className="col-xs-6">Payment Type: {payments.currentPayment.payment_type_display} {payments.currentPayment.check_number ? `(#${payments.currentPayment.check_number})` : null}</p>
                                                <p className="col-xs-6">Paid Roads: {payments.currentPayment.dollar_values && payments.currentPayment.dollar_values.paid_roads}</p>
                                                <p className="col-xs-6">Paid Sewer Capacity: {payments.currentPayment.dollar_values && payments.currentPayment.dollar_values.paid_sewer_cap}</p>
                                                <p className="col-xs-6">Paid Parks: {payments.currentPayment.dollar_values && payments.currentPayment.dollar_values.paid_parks}</p>
                                                <p className="col-xs-6">Paid Sewer Transmission: {payments.currentPayment.dollar_values && payments.currentPayment.dollar_values.paid_sewer_trans}</p>
                                                <p className="col-xs-12">Paid Storm: {payments.currentPayment.dollar_values && payments.currentPayment.dollar_values.paid_storm}</p>
                                                <p className="col-xs-12">Paid Open Space: {payments.currentPayment.dollar_values && payments.currentPayment.dollar_values.paid_open_space}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {payments && payments.currentPayment.id &&
                                        <Notes
                                            content_type="accounts_payment"
                                            object_id={payments.currentPayment.id}
                                            ariaExpanded="false"
                                            panelClass="panel-collapse collapse row"
                                            permission="payment"
                                        />
                                    }

                                    <LotsMiniSummary
                                        mapSet={payments.currentPayment.lot_id}
                                        mapQualifier={payments && payments.currentPayment.lot_id}
                                        singleLot
                                    />

                                    <AccountsMiniSummary
                                        mapSet={payments.currentPayment.credit_account}
                                        mapQualifier={payments.currentPayment.credit_account}
                                        singleAccount
                                        title="Developer Account"
                                        accordionID="Account"
                                    />

                                    <AgreementsMiniSummary
                                        mapSet={payments.currentPayment.credit_source}
                                        mapQualifier={payments.currentPayment.credit_source}
                                        singleAgreement
                                    />

                                </div>
                            }
                        </div>
                      )}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

PaymentSummary.propTypes = {
    currentUser: PropTypes.object,
    payments: PropTypes.array,
    route: PropTypes.object,
    activeForm: PropTypes.object,
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        payments: !!state.payments && state.payments,
        activeForm: state.activeForm,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedPayment = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(getPaymentID(selectedPayment))
            .then(() => {
                dispatch(formUpdate({ loading: false }));
            });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentSummary);

