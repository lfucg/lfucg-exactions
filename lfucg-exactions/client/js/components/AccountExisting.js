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

                <SearchBar
                  apiField1DisplayName={'Plat'}
                  apiField2DisplayName={'Lot'}
                  filterField1={'filter_plat_account__id'}
                  filterField2={'filter_lot_account__id'}
                  apiCall1={getPlats}
                  apiCall2={getLots}
                />

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
    };
}

AccountExisting.propTypes = {
    currentUser: PropTypes.object,
    accounts: PropTypes.array,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountExisting);

