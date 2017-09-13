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
            delay,
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
                    <form className="col-sm-10 col-sm-offset-1" >
                        <fieldset>
                            <div className="col-sm-2 col-xs-12">
                                <label htmlFor="query" className="form-label">Search</label>
                            </div>
                            <div className="col-sm-10 col-xs-12">
                                <input
                                  onKeyUp={() => {
                                      delay(() => {
                                          onAccountQuery(this.query.name, this.query.value);
                                      }, 500);
                                  }}
                                  ref={(query) => { this.query = query }}
                                  type="text"
                                  className="form-control"
                                  placeholder="Search Developer Accounts"
                                  name="query"
                                />
                            </div>
                        </fieldset>
                    </form>
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
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(getPagination('/account/'));
        },
        delay: (function() {
            let timer = 0;
            return (callback, ms) => {
                clearTimeout(timer);
                timer = setTimeout(callback, ms);
            };
        })(),
        onAccountQuery(field, value) {
            const update = {
                [field]: value,
            };
            dispatch(formUpdate(update));
            dispatch(getAccountQuery());
        },
    };
}

AccountExisting.propTypes = {
    currentUser: PropTypes.object,
    accounts: PropTypes.array,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
    onAccountQuery: PropTypes.func,
    delay: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountExisting);

