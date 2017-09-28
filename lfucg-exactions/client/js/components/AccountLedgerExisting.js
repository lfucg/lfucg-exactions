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
                                { accountLedger.account_from &&
                                    <p className="col-md-4 col-xs-6">Account From: {accountLedger.account_from.account_name}</p>
                                }
                                { accountLedger.account_to &&
                                    <p className="col-md-4 col-xs-6">Account To: {accountLedger.account_to.account_name}</p>
                                }
                                { accountLedger.agreement &&
                                    <p className="col-md-4 col-xs-6">Agreement: {accountLedger.agreement.resolution_number}</p>
                                }
                                { accountLedger.lot &&
                                    <p className="col-xs-12">Lot: {accountLedger.lot.address_full}</p>
                                }
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

                <SearchBar />

                <div className="inside-body">
                    <div className="container">
                        {accountLedgers_list}
                        {accountLedgers_list ? <Pagination /> : <h1>No Results Found</h1>}
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
            dispatch(getPagination('/ledger/'));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountLedgerExisting);

