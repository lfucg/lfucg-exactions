import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

import {
    getAccountID,
} from '../actions/apiActions';

class AccountSummary extends React.Component {
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

        return (
            <div className="account-summary">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>ACCOUNTS - SUMMARY</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'account'} parent_name={'Accounts'} />

                <div className="inside-body">
                    <div className="container">
                        <div className="col-md-offset-1 col-md-10 panel-group" id="accordion" role="tablist" aria-multiselectable="false">
                            <a
                              role="button"
                              data-toggle="collapse"
                              data-parent="#accordion"
                              href="#collapseAccountInfo"
                              aria-expanded="false"
                              aria-controls="collapseAccountInfo"
                            >
                                <div className="row section-heading" role="tab" id="headingAccountInfo">
                                    <h2>Account Information</h2>
                                    <h4>(Click to View or Edit)</h4>
                                </div>
                            </a>
                            <div
                              id="collapseAccountInfo"
                              className="panel-collapse collapse row"
                              role="tabpanel"
                              aria-labelledby="#headingAccountInfo"
                            >
                                <div className="panel-body">
                                    <div className="col-xs-12">
                                        <h4 className="col-md-4 col-xs-6">Account Name: {accounts.account_name}</h4>
                                        <h4 className="col-md-4 col-xs-6">Contact Name: {accounts.contact_full_name}</h4>
                                        <h4 className="col-xs-12">Address: {accounts.address_full}</h4>
                                        <h4 className="col-md-4 col-xs-6 ">Phone: {accounts.phone}</h4>
                                        <h4 className="col-md-4 col-xs-6">Email: {accounts.email}</h4>
                                    </div>
                                </div>
                            </div>
                            <a
                              role="button"
                              data-toggle="collapse"
                              data-parent="#accordion"
                              href="#collapseAccountPlats"
                              aria-expanded="false"
                              aria-controls="collapseAccountPlats"
                            >
                                <div className="row section-heading" role="tab" id="headingAccountPlats">
                                    <h2>Account Plats</h2>
                                    <h4>(Click to View or Edit)</h4>
                                </div>
                            </a>
                            <div
                              id="collapseAccountPlats"
                              className="panel-collapse collapse row"
                              role="tabpanel"
                              aria-labelledby="#headingAccountPlats"
                            >
                                <div className="panel-body">
                                    <div className="col-xs-12">
                                        Plats
                                    </div>
                                </div>
                            </div>
                        </div>
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

function mapDispatchToProps(dispatch, params) {
    const selectedAccount = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(getAccountID(selectedAccount));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountSummary);

