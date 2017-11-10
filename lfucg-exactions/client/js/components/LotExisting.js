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
    getPlats,
    getAccounts,
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
        } = this.props;

        const platsList = plats && plats.length > 0 &&
            (map((single_plat) => {
                const cabinet = single_plat.cabinet ? `${single_plat.cabinet}-` : '';
                const slide = single_plat.slide ? single_plat.slide : single_plat.name;
                return {
                    id: single_plat.id,
                    name: `${cabinet}${slide}`,
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
                                <div className="col-xs-12 col-sm-5 col-sm-offset-7">
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
                                    <p className="col-md-4 col-xs-6">Plat: {lot.plat.cabinet}-{lot.plat.slide}</p>
                                    <p className="col-md-4 col-xs-6">Lot Number: {lot.lot_number}</p>
                                    <p className="col-md-4 col-xs-6 ">Permit ID: {lot.permit_id}</p>
                                </div>
                            </div>
                        </div>}
                    </div>
                );
            })(lots)
        ) : null;

        return (
            <div className="lot-existing">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>LOTS - EXISTING</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} route_permission="lot" />


                <SearchBar
                  apiCalls={[getPlats, getAccounts]}
                  advancedSearch={[
                    { filterField: 'filter_plat', displayName: 'Plat', list: platsList },
                    { filterField: 'filter_account', displayName: 'Developer', list: accountsList },
                    { filterField: 'filter_is_approved', displayName: 'Approval', list: [{ id: true, name: 'Approved' }, { id: false, name: 'Unapproved' }] },
                  ]}
                  csvEndpoint="../api/lot_search_csv/?"
                  currentPage="Lots"
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
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        lots: state.lots,
        plats: state.plats,
        accounts: state.accounts,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(getPagination('/lot/'));
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(LotExisting);
