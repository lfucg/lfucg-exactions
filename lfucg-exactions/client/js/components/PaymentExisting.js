import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

import {
    getPayments,
    getPaymentQuery,
} from '../actions/apiActions';

import {
    formUpdate,
} from '../actions/formActions';

class PaymentExisting extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            currentUser,
            payments,
            onPaymentQuery,
        } = this.props;

        const payments_list = payments.length > 0 &&
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
                            <div className="col-sm-offset-1">
                                {payment.lot_id &&
                                    <p className="col-md-4 col-xs-6">Lot: {payment.lot_id.address_full}</p>
                                }
                                <p className="col-md-4 col-xs-6">Agreement Credit Source: {payment.credit_source}</p>
                                <p className="col-md-4 col-xs-6 ">Developer Credit Account: {payment.credit_account}</p>
                                <p className="col-md-4 col-xs-6">Payment Type: {payment.payment_type}</p>
                            </div>
                        </div>
                    </div>
                );
            })(payments);

        return (
            <div className="payment-existing">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>PAYMENTS - EXISTING</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} />

                <div className="row search-box">
                    <form onChange={onPaymentQuery('query')} className="col-sm-10 col-sm-offset-1" >
                        <fieldset>
                            <div className="col-sm-2 col-xs-12">
                                <label htmlFor="query" className="form-label">Search</label>
                            </div>
                            <div className="col-sm-10 col-xs-12">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Search Payments"
                                />
                            </div>
                        </fieldset>
                    </form>
                </div>

                <div className="inside-body">
                    <div className="container">
                        {payments_list}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

PaymentExisting.propTypes = {
    currentUser: PropTypes.object,
    payments: PropTypes.object,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
    onPaymentQuery: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        payments: state.payments,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(getPayments());
        },
        onPaymentQuery(field) {
            return (e, ...args) => {
                const value = typeof e.target.value !== 'undefined' ? e.target.value : args[1];
                const update = {
                    [field]: value,
                };
                dispatch(formUpdate(update));
                dispatch(getPaymentQuery());
            };
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentExisting);

