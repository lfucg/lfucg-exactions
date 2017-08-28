import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';

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
    static propTypes = {
        currentUser: React.PropTypes.object,
        payments: React.PropTypes.object,
        route: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
        onPaymentQuery: React.PropTypes.func,
    };

    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            currentUser,
            payments,
            onPaymentQuery,
        } = this.props;

        const payments_list = payments.length > 0 ? (
            map((payment) => {
                return (
                    <div key={payment.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <div className="col-sm-7 col-md-9">
                                <h3>Developer Account: {payment.credit_account.account_name}</h3>
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
                            <div className="col-sm-offset-1">
                                <p className="col-md-4 col-xs-6">Credit Source: {payment.credit_source.resolution_number}</p>
                                <p className="col-md-4 col-xs-6">Payment Type: {payment.payment_type}</p>
                                <p className="col-xs-12">Lot: {payment.lot_id.address_full}</p>
                            </div>
                        </div>
                    </div>
                );
            })(payments)
        ) : null;

        return (
            <div className="payment-existing">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <div className="col-sm-8">
                            <h1>PAYMENTS - EXISTING</h1>
                        </div>
                        {currentUser && currentUser.permissions && currentUser.permissions.payment &&
                            <div className="col-sm-2 col-sm-offset-1">
                                <Link to={'payment/form/'} className="btn btn-top-level" >
                                    Create
                                </Link>
                            </div>
                        }
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

