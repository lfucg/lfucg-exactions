import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

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
                                    <div className="row link-row">
                                        <div className="col-xs-12 col-sm-5 col-md-3 col-sm-offset-7 col-md-offset-9">
                                            <div className="col-xs-5 col-xs-offset-5">
                                                {currentUser && currentUser.permissions && currentUser.permissions.payment &&
                                                    <Link to={`payment/form/${payments.id}`} aria-label="Edit">
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
                                        <p className="col-md-4 col-xs-6">Payment Category: {payments.payment_category}</p>
                                        <p className="col-md-4 col-xs-6">Payment Type: {payments.payment_type}</p>
                                        <p className="col-md-4 col-xs-6">Paid By: {payments.paid_by}</p>
                                        <p className="col-md-4 col-xs-6">Paid By Type: {payments.paid_by_type_display}</p>
                                        <p className="col-md-4 col-xs-6">Check Number: {payments.check_number}</p>
                                        <p className="col-md-4 col-xs-6">Paid Roads: ${payments.paid_roads}</p>
                                        <p className="col-md-4 col-xs-6">Paid Sewer Capacity: ${payments.paid_sewer_cap}</p>
                                        <p className="col-md-4 col-xs-6">Paid Sewer Transmission: ${payments.paid_sewer_trans}</p>
                                        <p className="col-md-4 col-xs-6">Paid Parks: ${payments.paid_park}</p>
                                        <p className="col-md-4 col-xs-6">Paid Storm: ${payments.paid_storm}</p>
                                        <p className="col-md-4 col-xs-6">Paid Open Space: ${payments.paid_open_space}</p>
                                    </div>
                                </div>
                            </div>

                            {payments && payments.lot_id ? <div>
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
                                        <div className="row link-row">
                                            <div className="col-xs-12 col-sm-5 col-md-3 col-sm-offset-7 col-md-offset-9">
                                                <div className="col-xs-5">
                                                    {currentUser && currentUser.permissions && currentUser.permissions.lot &&
                                                        <Link to={`lot/form/${payments.lot_id.id}`} aria-label="Edit">
                                                            <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                            <div className="col-xs-7 link-label">
                                                                Edit
                                                            </div>
                                                        </Link>
                                                    }
                                                </div>
                                                <div className="col-xs-5 ">
                                                    <Link to={`lot/summary/${payments.lot_id.id}`} aria-label="Summary">
                                                        <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                                        <div className="col-xs-7 link-label">
                                                            Summary
                                                        </div>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xs-12">
                                            <p className="col-xs-12">Lot Address: {payments.lot_id.address_full}</p>
                                            <p className="col-md-4 col-xs-6">Total Exactions: {payments.lot_id.total_due}</p>
                                            <p className="col-md-4 col-xs-6">Plat: {payments.lot_id.plat.name}</p>
                                            <p className="col-md-4 col-xs-6 ">Lot Number: {payments.lot_id.lot_number}</p>
                                            <p className="col-md-4 col-xs-6">Permit ID: {payments.lot_id.permit_id}</p>
                                        </div>
                                    </div>
                                </div>
                            </div> : <div className="row section-heading" role="tab" id="headingLotInfo">
                                <h2>Lot - None</h2>
                            </div>}

                            {payments.credit_account ? <div>
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
                                            <h2>Developer Credit Account</h2>
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
                                                        <Link to={`account/form/${payments.credit_account.id}`} aria-label="Edit">
                                                            <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                            <div className="col-xs-7 link-label">
                                                                Edit
                                                            </div>
                                                        </Link>
                                                    }
                                                </div>
                                                <div className="col-xs-5 ">
                                                    <Link to={`account/summary/${payments.credit_account.id}`} aria-label="Summary">
                                                        <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                                        <div className="col-xs-7 link-label">
                                                            Summary
                                                        </div>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xs-12">
                                            <p className="col-md-4 col-xs-6">Developer Account Name: {payments.credit_account.account_name}</p>
                                            <p className="col-md-4 col-xs-6">{payments.credit_account.balance && payments.credit_account.balance.credit_availability}</p>
                                            {currentUser && currentUser.username &&
                                                <div>
                                                    <p className="col-md-4 col-xs-6">Account Balance: {payments.credit_account.balance && payments.credit_account.balance.balance}</p>
                                                    <p className="col-md-4 col-xs-6">Contact Name: {payments.credit_account.contact_full_name}</p>
                                                    <p className="col-md-4 col-xs-6 ">Phone: {payments.credit_account.phone}</p>
                                                    <p className="col-md-4 col-xs-6">Email: {payments.credit_account.email}</p>
                                                    <p className="col-xs-12">Address: {payments.credit_account.address_full}</p>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div> : <div className="row section-heading" role="tab" id="headingAccountInfo">
                                <h2>Developer Account - None</h2>
                            </div>}

                            {payments.credit_source ? <div>
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
                                            <h2>Agreement Credit Source</h2>
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
                                                        <Link to={`agreement/form/${payments.credit_source.id}`} aria-label="Edit">
                                                            <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                            <div className="col-xs-7 link-label">
                                                                Edit
                                                            </div>
                                                        </Link>
                                                    }
                                                </div>
                                                <div className="col-xs-5 ">
                                                    <Link to={`agreement/summary/${payments.credit_source.id}`} aria-label="Summary">
                                                        <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                                        <div className="col-xs-7 link-label">
                                                            Summary
                                                        </div>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xs-12">
                                            <p className="col-md-4 col-xs-6">Resolution Number: {payments.credit_source.resolution_number}</p>
                                            <p className="col-md-4 col-xs-6">Account: {payments.credit_source.account_id.account_name}</p>
                                            <p className="col-md-4 col-xs-6">Expansion Area: {payments.credit_source.expansion_area}</p>
                                            <p className="col-md-4 col-xs-6">Agreement Type: {payments.credit_source.agreement_type_display}</p>
                                            <p className="col-md-4 col-xs-6">Date Executed: {payments.credit_source.date_executed}</p>
                                        </div>
                                    </div>
                                </div>
                            </div> : <div className="row section-heading" role="tab" id="headingAgreementInfo">
                                <h2>Payments - None</h2>
                            </div>}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

PaymentSummary.propTypes = {
    currentUser: PropTypes.object,
    payments: PropTypes.object,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
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
            dispatch(getPaymentID(selectedPayment));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentSummary);

