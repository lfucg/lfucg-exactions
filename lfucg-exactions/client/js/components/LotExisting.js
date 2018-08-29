import React from 'react';
import { connect } from 'react-redux';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Pagination from './Pagination';
import SearchBar from './SearchBar';
import ExistingPageLinks from './ExistingPageLinks';

import {
    getPagination,
    getPlatsQuick,
    getAccountsQuick,
} from '../actions/apiActions';

import LoadingScreen from './LoadingScreen';
import {
    formUpdate,
} from '../actions/formActions';

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

        const lots_list = !!lots && !!lots.lots && lots.lots.length > 0 ? (
            map((lot) => {
                return (
                    <div key={lot.id} className="col-xs-12">
                        {(currentUser.id || lot.is_approved) && <div>
                            <ExistingPageLinks
                              linkStart="lot"
                              approval={lot.is_approved}
                              title={lot.address_full}
                              permissionModel="lot"
                              instanceID={lot.id}
                              uniqueReport={false}
                            />
                            <div className="row">
                                <div className="col-sm-offset-1">
                                    <h3 className="col-xs-12">Current Exactions: {lot.lot_exactions && lot.lot_exactions.total_exactions}</h3>
                                    <p className="col-md-4 col-xs-6">Plat: {lot.plat.cabinet}-{lot.plat.slide}</p>
                                    <p className="col-md-4 col-xs-6">Lot Number: {lot.lot_number}</p>
                                    <p className="col-md-4 col-xs-6 ">Permit ID: {lot.permit_id}</p>
                                </div>
                            </div>
                        </div>}
                    </div>
                );
            })(lots.lots)
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
                  apiCalls={[getPlatsQuick, getAccountsQuick]}
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
                        {lots.loadingLot ? <LoadingScreen /> :
                        (
                            <div>
                                {lots_list}
                                {lots_list ? 
                                    <Pagination 
                                        next={lots.next}
                                        prev={lots.prev}
                                        count={lots.count}
                                    /> : 
                                    <h1>No Results Found</h1>
                                }
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

LotExisting.propTypes = {
    currentUser: PropTypes.object,
    lots: PropTypes.object,
    plats: PropTypes.array,
    accounts: PropTypes.array,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        lots: state.lots,
        plats: state.plats && state.plats.plats,
        accounts: state.accounts && state.accounts.accounts,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(getPagination('/lot/'))
            .then(() => {
                dispatch(formUpdate({ loading: false }));
            });
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(LotExisting);
