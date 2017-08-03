import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

import {
    getAccounts,
} from '../actions/apiActions';

class AccountExisting extends React.Component {
    static propTypes = {
        accounts: React.PropTypes.object,
        route: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
    };

    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            accounts,
        } = this.props;

        const accounts_list = accounts.length > 0 ? (
            map((account) => {
                return (
                    <div key={account.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <Link to={`account/summary/${account.id}`} role="link" className="page-link">
                                <h3>
                                    {account.account_name}
                                    <i className="fa fa-link" aria-hidden="true" />
                                </h3>
                            </Link>
                        </div>
                        <div className="row">
                            <div className="col-sm-offset-1">
                                <p className="col-md-4 col-xs-6">Account Name: {account.account_name}</p>
                                <p className="col-md-4 col-xs-6">Contact Name: {account.contact_full_name}</p>
                                <p className="col-xs-12">Address: {account.address_full}</p>
                                <p className="col-md-4 col-xs-6 ">Phone: {account.phone}</p>
                                <p className="col-md-4 col-xs-6">Email: {account.email}</p>
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
        accounts: state.accounts,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(getAccounts());
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountExisting);

