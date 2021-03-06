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

import { entry_types } from '../constants/searchBarConstants';

import {
    getPagination,
    getAgreementsQuick,
    getLotsQuick,
    getAccountsQuick,
} from '../actions/apiActions';

import LoadingScreen from './LoadingScreen';
import { formUpdate } from '../actions/formActions';

class AccountLedgerExisting extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            currentUser,
            accountLedgers,
            lots,
            agreements,
            accounts,
        } = this.props;

        const agreementsList = agreements && agreements.length > 0 &&
            (map((single_agreement) => {
                return {
                    id: single_agreement.id,
                    name: single_agreement.resolution_number,
                };
            })(agreements));

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

        const accountLedgers_list = !!accountLedgers && !!accountLedgers.accountLedgers && accountLedgers.accountLedgers.length > 0 ? (
            map((accountLedger) => {
                return (
                    <div key={accountLedger.id} className="col-xs-12">
                        {(currentUser.id || accountLedger.is_approved) && <div>
                            <ExistingPageLinks
                              linkStart="credit-transfer"
                              approval={accountLedger.is_approved}
                              title={accountLedger.entry_type_display}
                              permissionModel="accountledger"
                              instanceID={accountLedger.id}
                              uniqueReport={false}
                            />
                            <div className="row">
                                <div className="col-sm-offset-1">
                                    { accountLedger.account_from &&
                                        <p className="col-xs-6">Account From: {accountLedger.account_from.account_name}</p>
                                    }
                                    { accountLedger.account_to &&
                                        <p className="col-xs-6">Account To: {accountLedger.account_to.account_name}</p>
                                    }
                                    <p className="col-xs-6">Non-Sewer: {accountLedger.dollar_values && accountLedger.dollar_values.dollar_non_sewer}</p>
                                    <p className="col-xs-6">Sewer: {accountLedger.dollar_values && accountLedger.dollar_values.dollar_sewer}</p>
                                    { accountLedger.agreement &&
                                        <p className="col-xs-6">Agreement: {accountLedger.agreement.resolution_number}</p>
                                    }
                                    { accountLedger.lot &&
                                        <p className="col-xs-12">Lot: {accountLedger.lot.address_full}</p>
                                    }
                                </div>
                            </div>
                        </div>}
                    </div>
                );
            })(accountLedgers.accountLedgers)
        ) : null;

        return (
            <div className="accountLedger-existing">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>CREDIT TRANSFERS - EXISTING</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} route_permission="accountledger" />

                <SearchBar
                  apiCalls={[getAgreementsQuick, getLotsQuick, getAccountsQuick]}
                  advancedSearch={[
                    { filterField: 'filter_entry_type', displayName: 'Type', list: entry_types },
                    { filterField: 'filter_agreement', displayName: 'Agreement', list: agreementsList },
                    { filterField: 'filter_account_to', displayName: 'Account To', list: accountsList },
                    { filterField: 'filter_account_from', displayName: 'Account From', list: accountsList },
                    { filterField: 'filter_lot', displayName: 'Lots', list: lotsList },
                    { filterField: 'filter_is_approved', displayName: 'Approval', list: [{ id: true, name: 'Approved' }, { id: false, name: 'Unapproved' }] },
                  ]}
                  currentPage="Credit Transfers"
                  csvEndpoint="../api/ledger_search_csv/?"
                  dateFilters={true}
                />

                <div className="inside-body">
                    <div className="container">
                        {accountLedgers.loadingLedger ? <LoadingScreen /> :
                        (
                            <div>
                                {accountLedgers_list}
                                {accountLedgers_list ? 
                                    <Pagination
                                        next={accountLedgers.next}
                                        prev={accountLedgers.prev}
                                        count={accountLedgers.count} 
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

AccountLedgerExisting.propTypes = {
    currentUser: PropTypes.object,
    accountLedgers: PropTypes.object,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
    agreements: PropTypes.array,
    lots: PropTypes.array,
    accounts: PropTypes.array,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        accounts: state.accounts && state.accounts.accounts,
        accountLedgers: state.accountLedgers,
        agreements: state.agreements && state.agreements.agreements,
        lots: state.lots && state.lots.lots,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(getPagination('/ledger/'))
            .then(() => {
                dispatch(formUpdate({ loading: false }));
            });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountLedgerExisting);

