import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

import {
    getAccountLedgers,
    getAccountLedgerQuery,
} from '../actions/apiActions';

import {
    formUpdate,
} from '../actions/formActions';

class AccountLedgerExisting extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            currentUser,
            accountLedgers,
            onAccountLedgerQuery,
        } = this.props;

        const accountLedgers_list = accountLedgers.length > 0 ? (
            map((accountLedger) => {
                return (
                    <div key={accountLedger.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <div className="col-sm-7 col-md-9">
                                <h3>{accountLedger.entry_type_display}</h3>
                            </div>
                        </div>
                        <div className="row link-row">
                            <div className="col-xs-12 col-sm-5 col-md-3 col-sm-offset-7 col-md-offset-9">
                                <div className="col-xs-5">
                                    {currentUser && currentUser.permissions && currentUser.permissions.accountledger &&
                                        <Link to={`account-ledger/form/${accountLedger.id}`} aria-label="Edit">
                                            <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                            <div className="col-xs-7 link-label">
                                                Edit
                                            </div>
                                        </Link>
                                    }
                                </div>
                                <div className="col-xs-5 ">
                                    <Link to={`account-ledger/summary/${accountLedger.id}`} aria-label="Summary">
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
                                {accountLedger.lot && accountLedger.lot.address_full &&
                                    <p className="col-md-4 col-xs-6">Lot: {accountLedger.lot.address_full}</p>
                                }
                                <p className="col-md-4 col-xs-6">Account From: {accountLedger.account_from}</p>
                                <p className="col-md-4 col-xs-6">Account To: {accountLedger.account_to}</p>
                                <p className="col-md-4 col-xs-6">Agreement: {accountLedger.agreement}</p>
                            </div>
                        </div>
                    </div>
                );
            })(accountLedgers)
        ) : null;

        return (
            <div className="accountLedger-existing">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>ACCOUNT LEDGERS - EXISTING</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} />

                <div className="row search-box">
                    <form onChange={onAccountLedgerQuery('query')} className="col-sm-10 col-sm-offset-1" >
                        <fieldset>
                            <div className="col-sm-2 col-xs-12">
                                <label htmlFor="query" className="form-label">Search</label>
                            </div>
                            <div className="col-sm-10 col-xs-12">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Search Account Ledgers"
                                />
                            </div>
                        </fieldset>
                    </form>
                </div>

                <div className="inside-body">
                    <div className="container">
                        {accountLedgers_list}
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
    onAccountLedgerQuery: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        accountLedgers: state.accountLedgers,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(getAccountLedgers());
        },
        onAccountLedgerQuery(field) {
            return (e, ...args) => {
                const value = typeof e.target.value !== 'undefined' ? e.target.value : args[1];
                const update = {
                    [field]: value,
                };
                dispatch(formUpdate(update));
                dispatch(getAccountLedgerQuery());
            };
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountLedgerExisting);

