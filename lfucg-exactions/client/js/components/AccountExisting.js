import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

import {
    getAccounts,
    getAccountQuery,
} from '../actions/apiActions';

import {
    formUpdate,
} from '../actions/formActions';

class AccountExisting extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            currentUser,
            accounts,
            onAccountQuery,
        } = this.props;

        const accounts_list = accounts.length > 0 ? (
            map((account) => {
                return (
                    <div key={account.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <div className="col-sm-7 col-md-9">
                                <h3>{account.account_name}</h3>
                            </div>
                            <div className="col-sm-5 col-md-3">
                                <div className="col-xs-5">
                                    {currentUser && currentUser.permissions && currentUser.permissions.account &&
                                        <Link to={`account/form/${account.id}`} className="btn btn-mid-level">
                                            Edit
                                        </Link>
                                    }
                                </div>
                                <div className="col-xs-5 col-xs-offset-1">
                                    <Link to={`account/summary/${account.id}`} className="btn btn-mid-level">
                                        Summary
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-offset-1">
                                <p className="col-md-4 col-xs-6">Developer Account Name: {account.account_name}</p>
                                <p className="col-md-4 col-xs-6">Contact Name: {account.contact_full_name}</p>
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
                        <div className="col-sm-8">
                            <h1>ACCOUNTS - EXISTING</h1>
                        </div>
                        {currentUser && currentUser.permissions && currentUser.permissions.account &&
                            <div className="col-sm-2 col-sm-offset-1">
                                <Link to={'account/form/'} className="btn btn-top-level" >
                                    Create
                                </Link>
                            </div>
                        }
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} />

                <div className="row search-box">
                    <form onChange={onAccountQuery('query')} className="col-sm-10 col-sm-offset-1" >
                        <fieldset>
                            <div className="col-sm-2 col-xs-12">
                                <label htmlFor="query" className="form-label">Search</label>
                            </div>
                            <div className="col-sm-10 col-xs-12">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Search Developer Accounts"
                                />
                            </div>
                        </fieldset>
                    </form>
                </div>

                <div className="inside-body">
                    <div className="container">
                        {accounts_list}
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
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(getAccounts());
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
    };
}

AccountExisting.propTypes = {
    currentUser: PropTypes.object,
    accounts: PropTypes.object,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
    onAccountQuery: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountExisting);

