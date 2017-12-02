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

import {
    getPagination,
    getPlats,
    getLots,
} from '../actions/apiActions';


class AccountExisting extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            currentUser,
            accounts,
            plats,
            lots,
            activeForm,
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

        const lotsList = lots && lots.length > 0 &&
            (map((single_lot) => {
                return {
                    id: single_lot.id,
                    name: single_lot.address_full,
                };
            })(lots));

        const accounts_list = accounts && accounts.length > 0 ? (
            map((account) => {
                return (
                    <div key={account.id} className="col-xs-12">
                        <ExistingPageLinks
                          linkStart="account"
                          approval={true}
                          title={account.account_name}
                          permissionModel="account"
                          instanceID={account.id}
                          uniqueReport={true}
                        />
                        <div className="row">
                            <div className="col-sm-offset-1">
                                <p className="col-xs-6">Developer Account Name: {account.account_name}</p>
                                {account.balance && <p className="col-xs-6"><strong>{account.balance.credit_availability}</strong></p>}
                                {currentUser && currentUser.username && <div>
                                    <p className="col-xs-6">Contact Name: {account.contact_full_name}</p>
                                    {account.balance && <p className="col-xs-6">Account Balance: {account.balance.balance}</p>}
                                </div>}
                            </div>
                        </div>
                    </div>
                );
            })(accounts)
        ) : null;

        return (
            <div className="account-existing">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>ACCOUNTS - EXISTING</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} route_permission="account" />

                <SearchBar
                  apiCalls={[getPlats, getLots]}
                  advancedSearch={[
                    { filterField: 'filter_plat_account__id', displayName: 'Plat', list: platsList },
                    { filterField: 'filter_lot_account__id', displayName: 'Lot', list: lotsList },
                  ]}
                  currentPage="Accounts"
                  csvEndpoint="../api/export_account_csv/?"
                />

                <div className="inside-body">
                    <div className="container">
                        {activeForm.loading ? <LoadingScreen /> :
                        (
                            <div>
                                {accounts_list}
                                {accounts_list ? <Pagination /> : <h1>No Results Found</h1>}
                            </div>
                        )}
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
        accounts: state.accounts,
        plats: state.plats,
        lots: state.lots,
        activeForm: state.activeForm,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(getPagination('/account/'))
            .then(() => {
                dispatch(formUpdate({ loading: false }));
            });
        },
    };
}

AccountExisting.propTypes = {
    currentUser: PropTypes.object,
    accounts: PropTypes.array,
    plats: PropTypes.array,
    lots: PropTypes.array,
    route: PropTypes.object,
    activeForm: PropTypes.object,
    onComponentDidMount: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountExisting);

