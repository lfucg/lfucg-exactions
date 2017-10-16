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

import {
    getPagination,
    getAccounts,
    getSubdivisions,
    getLots,
} from '../actions/apiActions';

import { expansion_areas, plat_types } from '../constants/searchBarConstants';

class PlatExisting extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            currentUser,
            plats,
            accounts,
            subdivisions,
            lots,
        } = this.props;

        const lotsList = lots && lots.length > 0 &&
            (map((single_lot) => {
                return {
                    id: single_lot.id,
                    name: single_lot.address_full,
                };
            })(lots));

        const accountsList = accounts && accounts.length > 0 &&
            (map((single_account) => {
                return {
                    id: single_account.id,
                    name: single_account.account_name,
                };
            })(accounts));

        const subdivisionsList = subdivisions && subdivisions.length > 0 &&
            (map((single_subdivision) => {
                return {
                    id: single_subdivision.id,
                    name: single_subdivision.name,
                };
            })(subdivisions));

        const plats_list = plats && plats.length > 0 ? (
            map((plat) => {
                return (
                    <div key={plat.id} className="col-xs-12">
                        {(currentUser.id || plat.is_approved) && <div>
                            <div className={plat.is_approved ? 'row form-subheading' : 'row unapproved-heading'}>
                                <div className="col-sm-11">
                                    <h3>
                                        {plat.name}
                                        {!plat.is_approved && <span className="pull-right">Approval Pending</span>}
                                    </h3>
                                </div>
                            </div>
                            <div className={plat.is_approved ? 'row link-row' : 'row link-row-approval-pending'}>
                                <div className="col-xs-12 col-sm-7 col-md-5 col-sm-offset-5 col-md-offset-7">
                                    <div className="col-xs-3">
                                        {currentUser && currentUser.permissions && currentUser.permissions.plat &&
                                            <Link to={`plat/form/${plat.id}`} aria-label="Edit">
                                                <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                <div className="col-xs-7 link-label">
                                                    Edit
                                                </div>
                                            </Link>
                                        }
                                    </div>
                                    <div className="col-xs-4">
                                        {currentUser && currentUser.permissions && currentUser.permissions.plat &&
                                            <Link to={`plat/report/${plat.id}`} aria-label="Report">
                                                <i className="fa fa-line-chart link-icon col-xs-4" aria-hidden="true" />
                                                <div className="col-xs-7 link-label">
                                                    Report
                                                </div>
                                            </Link>
                                        }
                                    </div>
                                    <div className="col-xs-4 ">
                                        <Link to={`plat/summary/${plat.id}`} aria-label="Summary">
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
                                    <p className="col-xs-6">Sewer Remaining: {plat.plat_exactions && plat.plat_exactions.plat_sewer_due}</p>
                                    <p className="col-xs-6">Non-Sewer Remaining: {plat.plat_exactions && plat.plat_exactions.plat_non_sewer_due}</p>
                                    <p className="col-sm-4 col-xs-6">Slide: {plat.slide}</p>
                                    <p className="col-sm-4 col-xs-6">Cabinet: {plat.cabinet}</p>
                                    <p className="col-sm-4 col-xs-6">Section: {plat.section}</p>
                                    <p className="col-sm-4 col-xs-6">Block: {plat.block}</p>
                                    <p className="col-sm-4 col-xs-6">Expansion Area: {plat.expansion_area}</p>
                                </div>
                            </div>
                        </div>}
                    </div>
                );
            })(plats)
        ) : null;

        return (
            <div className="plat-existing">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>PLATS - EXISTING</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} />

                <SearchBar
                  apiCalls={[getAccounts, getSubdivisions, getLots]}
                  advancedSearch={[
                    { filterField: 'filter_expansion_area', displayName: 'EA', list: expansion_areas },
                    { filterField: 'filter_account', displayName: 'Developer', list: accountsList },
                    { filterField: 'filter_subdivision', displayName: 'Subdivision', list: subdivisionsList },
                    { filterField: 'filter_plat_type', displayName: 'Type', list: plat_types },
                    { filterField: 'filter_lot__id', displayName: 'Lot', list: lotsList },
                    { filterField: 'filter_is_approved', displayName: 'Approval', list: [{ id: true, name: 'Approved' }, { id: false, name: 'Unapproved' }] },
                  ]}
                />

                <div className="inside-body">
                    <div className="container">
                        {plats_list}
                        {plats_list ? <Pagination /> : <h1>No Results Found</h1>}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

PlatExisting.propTypes = {
    currentUser: PropTypes.object,
    plats: PropTypes.array,
    accounts: PropTypes.array,
    subdivisions: PropTypes.array,
    lots: PropTypes.array,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        plats: state.plats,
        accounts: state.accounts,
        subdivisions: state.subdivisions,
        lots: state.lots,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(getPagination('/plat/'));
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(PlatExisting);

