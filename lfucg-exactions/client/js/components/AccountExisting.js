import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Pagination from './Pagination';

import {
    getAccountQuery,
    getPagination,
    getPlats,
    getLots,
} from '../actions/apiActions';

import {
    formUpdate,
    formReset,
} from '../actions/formActions';

class AccountExisting extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            currentUser,
            plats,
            lots,
            accounts,
            onAccountQuery,
            onAccountFilter,
            advancedSearchPopulation,
            activeForm,
            clearFilters,
        } = this.props;

        const accounts_list = accounts && accounts.length > 0 ? (
            map((account) => {
                return (
                    <div key={account.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <div className="col-sm-7 col-md-9">
                                <h3>{account.account_name}</h3>
                            </div>
                        </div>
                        <div className="row link-row">
                            <div className="col-xs-12 col-sm-5 col-md-3 col-sm-offset-7 col-md-offset-9">
                                <div className="col-xs-5">
                                    {currentUser && currentUser.permissions && currentUser.permissions.account &&
                                        <Link to={`account/form/${account.id}`} aria-label="Edit">
                                            <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                            <div className="col-xs-7 link-label">
                                                Edit
                                            </div>
                                        </Link>
                                    }
                                </div>
                                <div className="col-xs-5 ">
                                    <Link to={`account/summary/${account.id}`} aria-label="Summary">
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
                                <p className="col-md-4 col-xs-6">Developer Account Name: {account.account_name}</p>
                                {account.balance && <p className="col-md-4 col-xs-6">{account.balance.credit_availability}</p>}
                                {currentUser && currentUser.username && <div>
                                    {account.balance && <p className="col-md-4 col-xs-6">Account Balance: {account.balance.balance}</p>}
                                    <p className="col-md-4 col-xs-6">Contact Name: {account.contact_full_name}</p>
                                </div>}
                            </div>
                        </div>
                    </div>
                );
            })(accounts)
        ) : null;

        const platsList = plats && plats.length > 0 &&
            (map((single_plat) => {
                return (
                    <option key={single_plat.id} value={single_plat.id} >
                        {single_plat.name}
                    </option>
                );
            })(plats));

        const lotsList = lots && lots.length > 0 &&
            (map((single_lot) => {
                return (
                    <option key={single_lot.id} value={single_lot.id} >
                        {single_lot.address_full}
                    </option>
                );
            })(lots));

        return (
            <div className="account-existing">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>ACCOUNTS - EXISTING</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} />

                <div className="row search-box">
                    <form onChange={onAccountQuery('filter_search')} className="col-sm-10 col-sm-offset-1" >
                        <fieldset>
                            <div className="col-sm-2 col-xs-12">
                                <label htmlFor="query" className="form-label">Search</label>
                            </div>
                            <div className="col-sm-10 col-xs-12">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Search Developer Accounts"
                                  id="query"
                                />
                            </div>
                        </fieldset>
                    </form>
                </div>
                <div>
                    <a
                      role="button"
                      data-toggle="collapse"
                      data-parent="#accordion"
                      href="#AdvancedSearch"
                      aria-expanded="false"
                      aria-controls="AdvancedSearch"
                      id="searchAccordionControl"
                    >
                        {activeForm.filterToggle ? (
                            <div className="row" role="tab" id="headingAdvancedSearch" onClick={clearFilters}>
                                <div className="col-xs-10 col-xs-offset-1 text-center">
                                    <h5>Clear All Search Filters</h5>
                                </div>
                            </div>
                            ) : (
                            <div className="row" role="tab" id="headingAdvancedSearch" onClick={advancedSearchPopulation}>
                                <div className="col-xs-10 col-xs-offset-1 text-center">
                                    <h5>Advanced Search</h5>
                                </div>
                            </div>
                            )
                        }
                    </a>
                    <div
                      id="AdvancedSearch"
                      className="collapse row"
                      aria-labelledby="#headingAdvancedSearch"
                    >
                        <div className="col-xs-12 text-center">
                            <div className="row">
                                <div className="col-sm-6 form-group">
                                    <div className="col-sm-2 col-xs-12">
                                        <label htmlFor="filter_plat_account__id" className="form-label">Plat</label>
                                    </div>
                                    <div className="col-sm-10 col-xs-12">
                                        <select
                                          className="form-control"
                                          onChange={() => onAccountFilter(this.plat_account)}
                                          ref={(input) => { this.plat_account = input; }}
                                          name="filter_plat_account__id"
                                        >
                                            <option value="">
                                                Select Plat
                                            </option>
                                            {platsList}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-6 form-group">
                                    <div className="col-sm-2 col-xs-12">
                                        <label htmlFor="filter_lot_account__id" className="form-label">Lot</label>
                                    </div>
                                    <div className="col-sm-10 col-xs-12">
                                        <select
                                          className="form-control"
                                          onChange={() => onAccountFilter(this.lot_account)}
                                          ref={(input) => { this.lot_account = input; }}
                                          name="filter_lot_account__id"
                                        >
                                            <option value="">
                                                Select Lot
                                            </option>
                                            {lotsList}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="inside-body">
                    <div className="container">
                        {accounts_list}
                        {accounts_list ? <Pagination /> : <h1>No Results Found</h1>}
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
            dispatch(getPagination('/account/'));
            dispatch(formUpdate({ currentPage: '/account/' }));
        },
        onAccountQuery(field) {
            return (e, ...args) => {
                const value = typeof e.target.value !== 'undefined' ? e.target.value : args[1];
                const update = {
                    [field]: value,
                };
                dispatch(formUpdate(update));
                dispatch(getAccountQuery());
            };
        },
        onAccountFilter(field) {
            const update = {
                [field.name]: field.value,
            };
            dispatch(formUpdate(update));
            dispatch(getAccountQuery());
        },
        advancedSearchPopulation() {
            dispatch(formUpdate({ filterToggle: true }));
            dispatch(getPlats());
            dispatch(getLots());
        },
        clearFilters() {
            dispatch(formUpdate({ filterToggle: false }));
            dispatch(formReset());
            document.getElementById('query').value = '';
            dispatch(getPagination('/account/'));
        },
    };
}

AccountExisting.propTypes = {
    currentUser: PropTypes.object,
    activeForm: PropTypes.object,
    plats: PropTypes.array,
    lots: PropTypes.array,
    accounts: PropTypes.array,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
    onAccountQuery: PropTypes.func,
    onAccountFilter: PropTypes.func,
    clearFilters: PropTypes.func,
    advancedSearchPopulation: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountExisting);

