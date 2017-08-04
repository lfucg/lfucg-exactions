import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';

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
    static propTypes = {
        accountLedgers: React.PropTypes.object,
        route: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
        onAccountLedgerQuery: React.PropTypes.func,
    };

    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            accountLedgers,
            onAccountLedgerQuery,
        } = this.props;

        const accountLedgers_list = accountLedgers.length > 0 ? (
            map((accountLedger) => {
                return (
                    <div key={accountLedger.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <div className="col-sm-7 col-md-9">
                                <h3>{accountLedger.entry_type}</h3>
                            </div>
                            <div className="col-sm-5 col-md-3">
                                <div className="col-xs-5">
                                    <Link to={`accountLedger/summary/${accountLedger.id}`} className="btn btn-mid-level">
                                        Summary
                                    </Link>
                                </div>
                                <div className="col-xs-5 col-xs-offset-1">
                                    <Link to={`accountLedger/form/${accountLedger.id}`} className="btn btn-mid-level">
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-offset-1">
                                <p className="col-md-4 col-xs-6">Lot: {accountLedger.lot}</p>
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
                        <div className="col-sm-8">
                            <h1>ACCOUNT LEDGERS - EXISTING</h1>
                        </div>
                        <div className="col-sm-2 col-sm-offset-1">
                            <Link to={'accountLedger/form/'} className="btn btn-top-level" >
                                Create
                            </Link>
                        </div>
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
                                  placeholder="Search AccountLedgers"
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

function mapStateToProps(state) {
    return {
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

