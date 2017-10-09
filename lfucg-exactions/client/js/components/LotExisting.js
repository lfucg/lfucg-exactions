import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map, filter } from 'ramda';
import PropTypes from 'prop-types';
import { CSVLink } from 'react-csv';
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
            removeSearchPagination,
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
                        <div className="row form-subheading">
                            <h3>{lot.address_full}</h3>
                        </div>
                        <div className="row link-row">
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
                    </div>
                );
            })(lots)
        ) : null;

        const headers = [
            'Address',
            'Date Modified',
            'Latitude',
            'Longitude',
            'Lot Number',
            'Parcel ID',
            'Permit ID',
            'Current Exactions',
            'Plat Name',
            'Plat Type',
            'Payments',
            'Last Payment',
            'Total Paid',
            'Roads',
            'Parks',
            'Storm',
            'Open Space',
        ];

        const csvData = lots && payments &&
            (map((single_lot) => {
                const paymentsOnCurrentLot = payments && payments.length > 0 &&
                    filter(payment => payment.lot_id.id === single_lot.id)(payments);
                console.log(paymentsOnCurrentLot.length);
                return [
                    single_lot.address_full || '',
                    single_lot.date_modified || '',
                    single_lot.latitude || '',
                    single_lot.longitude || '',
                    single_lot.lot_number || '',
                    single_lot.parcel_id || '',
                    single_lot.permit_id || '',
                    single_lot.lot_exactions.current_exactions || '',
                    single_lot.plat.name || '',
                    single_lot.plat.plat_zone_display || '',
                    paymentsOnCurrentLot && paymentsOnCurrentLot.length,
                    paymentsOnCurrentLot && (paymentsOnCurrentLot[0] ? paymentsOnCurrentLot[0].date_created : ''),
                    single_lot.longitude || '',
                    single_lot.longitude || '',
                    single_lot.longitude || '',
                    single_lot.longitude || '',
                    single_lot.longitude || '',
                ];
            })(lots));

        return (
            <div className="lot-existing">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>LOTS - EXISTING</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} />

                <div className="row">
                    <div className="col-xs-10 col-xs-offset-1">
                        <button type="button" className="btn btn-lex btn-sm pull-right" data-toggle="modal" data-target="#searchCSVModal" onClick={removeSearchPagination}>
                            <i className="fa fa-line-chart link-icon" aria-hidden="true" />&nbsp;Generate Search CSV
                        </button>
                    </div>
                </div>
                <div className="modal fade" id="searchCSVModal" tabIndex="-1" role="dialog" aria-labelledby="modalLabel">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h3 className="modal-title" id="modalLabel">Click below to download the CSV of your search results.</h3>
                            </div>
                            <div className="modal-body">
                                <CSVLink data={csvData} filename="another-name.csv" headers={headers}>Download me </CSVLink>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <SearchBar
                  apiCalls={[getPlats, getAccounts]}
                  advancedSearch={[
                    { filterField: 'filter_plat', displayName: 'Plat', list: platsList },
                    { filterField: 'filter_account', displayName: 'Developer', list: accountsList },
                  ]}
                />

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
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
    removeSearchPagination: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        lots: state.lots,
        plats: state.plats,
        accounts: state.accounts,
        payments: state.payments,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(getPagination('/lot/'));
            dispatch(getPayments());
        },
        removeSearchPagination() {
            dispatch(searchQuery('csv'));
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(LotExisting);

