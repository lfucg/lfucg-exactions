import React from 'react';
import { connect } from 'react-redux';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

import {
    getLotID,
    getAccountID,
    getAgreementID,
    getPaymentID,
} from '../actions/apiActions';

class PaymentSummary extends React.Component {
    static propTypes = {
        lots: React.PropTypes.object,
        accounts: React.PropTypes.object,
        agreements: React.PropTypes.object,
        payments: React.PropTypes.object,
        route: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
    };

    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            lots,
            accounts,
            agreements,
            payments,
        } = this.props;

        return (
            <div className="payment-summary">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>PAYMENT - SUMMARY</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'payment'} parent_name={'Payments'} />

                <div className="inside-body">
                    <div className="container">
                        <div className="col-md-offset-1 col-md-10 panel-group" id="accordion" role="tablist" aria-multiselectable="false">
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
                                        <h2>Payment Information</h2>
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
                                    <div className="col-xs-12">
                                        <p className="col-md-4 col-xs-6">Payment Category: {payments.payment_category}</p>
                                        <p className="col-md-4 col-xs-6">Payment Type: {payments.payment_type}</p>
                                        <p className="col-md-4 col-xs-6">Paid By: {payments.paid_by}</p>
                                        <p className="col-md-4 col-xs-6">Paid By Type: {payments.paid_by_type_display}</p>
                                        <p className="col-md-4 col-xs-6">Check Number: {payments.check_number}</p>
                                        <p className="col-md-4 col-xs-6">Paid Roads: {payments.paid_roads}</p>
                                        <p className="col-md-4 col-xs-6">Paid Sewer Capacity: {payments.paid_sewer_cap}</p>
                                        <p className="col-md-4 col-xs-6">Paid Sewer Transmission: {payments.paid_sewer_trans}</p>
                                        <p className="col-md-4 col-xs-6">Paid Parks: {payments.paid_park}</p>
                                        <p className="col-md-4 col-xs-6">Paid Storm: {payments.paid_storm}</p>
                                        <p className="col-md-4 col-xs-6">Paid Open Space: {payments.paid_open_space}</p>
                                    </div>
                                </div>
                            </div>

                            <a
                              role="button"
                              data-toggle="collapse"
                              data-parent="#accordion"
                              href="#collapseLotInfo"
                              aria-expanded="false"
                              aria-controls="collapseLotInfo"
                            >
                                <div className="row section-heading" role="tab" id="headingLotInfo">
                                    <div className="col-xs-1 caret-indicator" />
                                    <div className="col-xs-10">
                                        <h2>Lot</h2>
                                    </div>
                                </div>
                            </a>
                            <div
                              id="collapseLotInfo"
                              className="panel-collapse collapse row"
                              role="tabpanel"
                              aria-labelledby="#headingLotInfo"
                            >
                                <div className="panel-body">
                                    <div className="col-xs-12">
                                        <h4 className="col-xs-12">Lot Address: {lots.address_full}</h4>
                                        <h4 className="col-md-4 col-xs-6">Total Exactions: {lots.total_due}</h4>
                                        <h4 className="col-md-4 col-xs-6">Plat: {lots.plat}</h4>
                                        <h4 className="col-md-4 col-xs-6 ">Lot Number: {lots.lot_number}</h4>
                                        <h4 className="col-md-4 col-xs-6">Permit ID: {lots.permit_id}</h4>
                                    </div>
                                </div>
                            </div>

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
                                        <h2>Credit Account</h2>
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
                                        <h4 className="col-md-4 col-xs-6">Account Name: {accounts.account_name}</h4>
                                        <h4 className="col-md-4 col-xs-6">Contact Name: {accounts.contact_full_name}</h4>
                                        <h4 className="col-md-4 col-xs-6">Address: {accounts.address_full}</h4>
                                        <h4 className="col-md-4 col-xs-6 ">Phone: {accounts.phone}</h4>
                                        <h4 className="col-md-4 col-xs-6">Email: {accounts.email}</h4>
                                    </div>
                                </div>
                            </div>

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
                                        <h2>Credit Source</h2>
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
                                        <p className="col-md-4 col-xs-6">Account: {agreements.account_id}</p>
                                        <p className="col-md-4 col-xs-6">Expansion Area: {agreements.expansion_area}</p>
                                        <p className="col-md-4 col-xs-6">Agreement Type: {agreements.agreement_type_display}</p>
                                        <p className="col-md-4 col-xs-6">Date Executed: {agreements.date_executed}</p>
                                    </div>
                                </div>
                            </div>
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
        lots: state.lots,
        accounts: state.accounts,
        agreements: state.agreements,
        payments: state.payments,
        projects: state.projects,
        accountLedgers: state.accountLedgers,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedPayment = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(getPaymentID(selectedPayment))
            .then((data_payment) => {
                if (data_payment.response.lot_id) {
                    dispatch(getLotID(data_payment.response.lot_id));
                }
                if (data_payment.response.credit_account) {
                    dispatch(getAccountID(data_payment.response.credit_account));
                }
                if (data_payment.response.credit_source) {
                    dispatch(getAgreementID(data_payment.response.credit_source));
                }
            });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentSummary);

