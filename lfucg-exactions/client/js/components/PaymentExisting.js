import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Pagination from './Pagination';
import SearchBar from './SearchBar';

import { payment_types, paid_by_types } from '../constants/searchBarConstants';

import {
    getPagination,
    getAccounts,
    getLots,
    getAgreements,
} from '../actions/apiActions';

class PaymentExisting extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            currentUser,
            payments,
            accounts,
            lots,
            agreements,
        } = this.props;

        const accountsList = accounts && accounts.length > 0 &&
            (map((single_account) => {
                return {
                    id: single_account.id,
                    name: single_account.account_name,
                };
            })(accounts));

        const lotsList = lots && lots.length > 0 &&
            (map((single_lot) => {
                return {
                    id: single_lot.id,
                    name: single_lot.address_full,
                };
            })(lots));

        const agreementsList = agreements && agreements.length > 0 &&
            (map((single_agreement) => {
                return {
                    id: single_agreement.id,
                    name: single_agreement.resolution_number,
                };
            })(agreements));

        const payments_list = payments && payments.length > 0 &&
            map((payment) => {
                return (
                    <div key={payment.id} className="col-xs-12">
                        {(currentUser.id || payment.is_approved) && <div>
                            <div className={payment.is_approved ? 'row form-subheading' : 'row unapproved-heading'}>
                                <div className="col-sm-11">
                                    <h3>
                                        Developer Account: {payment.credit_account.account_name}
                                        {!payment.is_approved && <span className="pull-right">Approval Pending</span>}
                                    </h3>
                                </div>
                            </div>
                            <div className={payment.is_approved ? 'row link-row' : 'row link-row-approval-pending'}>
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
                                    <p className="col-md-4 col-xs-6">Agreement Resolution: {payment.credit_source && payment.credit_source.resolution_number}</p>
                                    <p className="col-md-4 col-xs-6">Payment Type: {payment.payment_type}</p>
                                    <p className="col-xs-12">Lot: {payment.lot_id.address_full}</p>
                                </div>
                            </div>
                        </div>}
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

                <SearchBar
                  apiCalls={[getAccounts, getLots, getAgreements]}
                  advancedSearch={[
                    { filterField: 'filter_paid_by_type', displayName: 'Paid By', list: paid_by_types },
                    { filterField: 'filter_payment_type', displayName: 'Payment Type', list: payment_types },
                    { filterField: 'filter_credit_account', displayName: 'Developer', list: accountsList },
                    { filterField: 'filter_lot_id', displayName: 'Lot', list: lotsList },
                    { filterField: 'filter_credit_source', displayName: 'Agreement', list: agreementsList },
                    { filterField: 'filter_is_approved', displayName: 'Approval', list: [{ id: true, name: 'Approved' }, { id: false, name: 'Unapproved' }] },
                  ]}
                />

                <div className="inside-body">
                    <div className="container">
                        {payments_list}
                        {payments_list ? <Pagination /> : <h1>No Results Found</h1>}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

PaymentExisting.propTypes = {
    currentUser: PropTypes.object,
    payments: PropTypes.array,
    route: PropTypes.object,
    accounts: PropTypes.array,
    lots: PropTypes.array,
    agreements: PropTypes.array,
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        payments: state.payments,
        accounts: state.accounts,
        lots: state.lots,
        agreements: state.agreements,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(getPagination('/payment/'));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentExisting);

