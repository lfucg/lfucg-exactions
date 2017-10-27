import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map, filter, reduce, compose } from 'ramda';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Pagination from './Pagination';
import SearchBar from './SearchBar';

import {
    getPagination,
    getPlats,
    getAccounts,
    searchQuery,
    getPayments,
    getAccountLedgers,
} from '../actions/apiActions';

class LotExisting extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            currentUser,
            lots,
            plats,
            accounts,
            payments,
            accountLedgers,
            activeForm,
        } = this.props;

        const platsList = plats && plats.length > 0 &&
            (map((single_plat) => {
                return {
                    id: single_plat.id,
                    name: single_plat.name,
                };
            })(plats));

        const accountsList = accounts && accounts.length > 0 &&
            (map((single_account) => {
                return {
                    id: single_account.id,
                    name: single_account.account_name,
                };
            })(accounts));

        const lots_list = lots.length > 0 ? (
            map((lot) => {
                return (
                    <div key={lot.id} className="col-xs-12">
                        {(currentUser.id || lot.is_approved) && <div>
                            <div className={lot.is_approved ? 'row form-subheading' : 'row unapproved-heading'}>
                                <div className="col-sm-11">
                                    <h3>
                                        {lot.address_full}
                                        {!lot.is_approved && <span className="pull-right">Approval Pending</span>}
                                    </h3>
                                </div>
                            </div>
                            <div className={lot.is_approved ? 'row link-row' : 'row link-row-approval-pending'}>
                                <div className="col-xs-12 col-sm-5 col-md-3 col-sm-offset-7 col-md-offset-9">
                                    <div className="col-xs-5">
                                        {currentUser && currentUser.permissions && currentUser.permissions.lot &&
                                            <Link to={`lot/form/${lot.id}`} aria-label="Edit">
                                                <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                <div className="col-xs-7 link-label">
                                                    Edit
                                                </div>
                                            </Link>
                                        }
                                    </div>
                                    <div className="col-xs-5 ">
                                        <Link to={`lot/summary/${lot.id}`} aria-label="Summary">
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
                                    <h3 className="col-xs-12">Current Exactions: {lot.lot_exactions && lot.lot_exactions.current_exactions}</h3>
                                    <p className="col-md-4 col-xs-6">Plat Name: {lot.plat.name}</p>
                                    <p className="col-md-4 col-xs-6">Lot Number: {lot.lot_number}</p>
                                    <p className="col-md-4 col-xs-6 ">Permit ID: {lot.permit_id}</p>
                                </div>
                            </div>
                        </div>}
                    </div>
                );
            })(lots)
        ) : null;

        const queryString = compose(
            reduce((acc, value) => acc + value, '../api/lot_search_csv/?'),
            map((a) => {
                const field = a[0].slice(7, a[0].length);
                return `&${field}=${a[1]}`;
            }),
            filter(a => a[1] && a[0].startsWith('filter_')),
        )(Object.entries(activeForm));

        const headers = [
            'Address',
            'Date Modified',
            'Latitude',
            'Longitude',
            'Lot Number',
            'Parcel ID',
            'Permit ID',
            'Plat Name',
            'Plat Type',
            'Total Exactions',
            'Sewer Due',
            'Non-Sewer Due',
            'Sewer Trans.',
            'Sewer Cap.',
            'Roads',
            'Parks',
            'Storm',
            'Open Space',
            'Current Total Due',
        ];
        let paymentLengthPerLot = 0;
        let ledgerLengthPerLot = 0;

        const csvData = lots.length > 0 ?
            (map((single_lot) => {
                const data = [
                    single_lot.address_full || '',
                    single_lot.date_modified || '',
                    single_lot.latitude || '',
                    single_lot.longitude || '',
                    single_lot.lot_number || '',
                    single_lot.parcel_id || '',
                    single_lot.permit_id || '',
                    single_lot.plat.name || '',
                    single_lot.plat.plat_type_display || '',
                    single_lot.lot_exactions.total_exactions || '',
                    single_lot.lot_exactions.sewer_due || '',
                    single_lot.lot_exactions.non_sewer_due || '',
                    single_lot.lot_exactions.dues_sewer_trans_dev || '',
                    single_lot.lot_exactions.dues_sewer_cap_dev || '',
                    single_lot.lot_exactions.dues_roads_dev || '',
                    single_lot.lot_exactions.dues_parks_dev || '',
                    single_lot.lot_exactions.dues_storm_dev || '',
                    single_lot.lot_exactions.dues_open_space_dev || '',
                    single_lot.lot_exactions.current_exactions || '',
                ];

                const paymentsOnCurrentLot = payments.length > 0 &&
                    filter(payment => payment.lot_id.id === single_lot.id)(payments);

                map((payment) => {
                    if (paymentLengthPerLot < paymentsOnCurrentLot.length) {
                        paymentLengthPerLot += 1;
                        headers.push(
                            `Pymt. ${paymentLengthPerLot} Date`,
                            `Pymt. ${paymentLengthPerLot} Amt.`,
                            `Pymt. ${paymentLengthPerLot} Type`,
                            );
                    }
                    data.push(
                        payment.date_created,
                        payment.total_paid,
                        payment.payment_type_display,
                        );

                })(paymentsOnCurrentLot);

                const ledgersOnCurrentLot = accountLedgers.length > 0 &&
                    filter(accountLedger => accountLedger.lot && accountLedger.lot.id === single_lot.id)(accountLedgers);

                map((ledger) => {
                    if (ledgerLengthPerLot < ledgersOnCurrentLot.length) {
                        ledgerLengthPerLot += 1;
                        headers.push(
                            `Trf. ${ledgerLengthPerLot} Date`,
                            `Trf. ${ledgerLengthPerLot} Sewer`,
                            `Trf. ${ledgerLengthPerLot} Non-Sewer`,
                            `Trf. ${ledgerLengthPerLot} Type`,
                            );
                    }

                    data.push(
                        ledger.entry_date,
                        ledger.sewer_credits,
                        ledger.non_sewer_credits,
                        ledger.entry_type_display,
                        );

                })(ledgersOnCurrentLot);

                return data;
            })(lots)) : 'none';

        return (
            <div className="lot-existing">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>LOTS - EXISTING</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} />


                <SearchBar
                  apiCalls={[getPlats, getAccounts]}
                  advancedSearch={[
                    { filterField: 'filter_plat', displayName: 'Plat', list: platsList },
                    { filterField: 'filter_account', displayName: 'Developer', list: accountsList },
                    { filterField: 'filter_is_approved', displayName: 'Approval', list: [{ id: true, name: 'Approved' }, { id: false, name: 'Unapproved' }] },
                  ]}
                />

                <div className="row">
                    <div className="col-xs-12 text-center">
                        <a href={`${queryString}`}>
                            <button type="button" className="btn button-modal-link" disabled={payments.length === 0}>
                                <i className="fa fa-download button-modal-icon" aria-hidden="true" />&nbsp;Generate CSV from Current Results
                            </button>
                        </a>
                    </div>
                </div>
                <div className="inside-body">
                    <div className="container">
                        {lots_list}
                        {lots_list ? <Pagination /> : <h1>No Results Found</h1>}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

LotExisting.propTypes = {
    currentUser: PropTypes.object,
    lots: PropTypes.array,
    plats: PropTypes.array,
    accounts: PropTypes.array,
    payments: PropTypes.array,
    accountLedgers: PropTypes.array,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
    activeForm: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        lots: state.lots,
        plats: state.plats,
        accounts: state.accounts,
        payments: state.payments,
        accountLedgers: state.accountLedgers,
        activeForm: state.activeForm,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(getPagination('/lot/'))
            .then(() => {
                dispatch(getPayments());
                dispatch(getAccountLedgers());
            });
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(LotExisting);
