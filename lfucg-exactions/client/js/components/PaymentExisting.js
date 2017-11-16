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
import ExistingPageLinks from './ExistingPageLinks';
import LoadingScreen from './LoadingScreen';

import {
    formUpdate,
} from '../actions/formActions';

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
            activeForm,
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
                            <ExistingPageLinks
                              linkStart="payment"
                              approval={payment.is_approved}
                              title={`Developer Account: ${payment.credit_account.account_name}`}
                              permissionModel="payment"
                              instanceID={payment.id}
                              uniqueReport={false}
                            />
                            <div className="row">
                                <div className="col-sm-offset-1">
                                    <h3 className="col-xs-12">Payment Total: {payment.total_paid}</h3>
                                    <p className="col-xs-6">Paid Sewer: ${(parseFloat(payment.paid_sewer_cap) + parseFloat(payment.paid_sewer_trans)).toLocaleString('en')}</p>
                                    <p className="col-xs-6">Paid Non-Sewer: ${(parseFloat(payment.paid_open_space) + parseFloat(payment.paid_parks) + parseFloat(payment.paid_roads) + parseFloat(payment.paid_storm)).toLocaleString('en')}</p>
                                    <p className="col-xs-6">Agreement Resolution: {payment.credit_source && payment.credit_source.resolution_number}</p>
                                    <p className="col-xs-6">Payment Type: {payment.payment_type_display} {payment.check_number ? `(#${payment.check_number})` : null}</p>
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

                <Breadcrumbs route={this.props.route} route_permission="payment" />

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
                  currentPage="Payments"
                  csvEndpoint="../api/payment_search_csv/?"
                />

                <div className="inside-body">
                    <div className="container">
                        {activeForm.loading ? <LoadingScreen /> :
                        (
                            <div>
                                {payments_list}
                                {payments_list ? <Pagination /> : <h1>No Results Found</h1>}
                            </div>
                        )}
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
    activeForm: PropTypes.object,
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
        activeForm: state.activeForm,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(getPagination('/payment/'))
            .then(() => {
                dispatch(formUpdate({ loading: false }));
            });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentExisting);

