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

        const plats_list = (accounts.plat_account && accounts.plat_account.length > 0) ? (
            map((plat) => {
                return (
                    <div key={plat.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <Link to={`plat/form/${plat.id}`} role="link" className="page-link">
                                <h3>
                                    {plat.name}
                                    <i className="fa fa-link" aria-hidden="true" />
                                </h3>
                            </Link>
                        </div>
                        <div className="row">
                            <div className="col-sm-offset-1">
                                <p className="col-md-3 col-sm-4 col-xs-6">Subdivision: {plat.subdivision ? plat.subdivision.name : 'Not listed'}</p>
                                <p className="col-md-3 col-sm-4 col-xs-6">Gross Acreage: {plat.cleaned_total_acreage}</p>
                                <p className="col-md-3 col-sm-4 col-xs-6">Plat Type: {plat.plat_type}</p>
                                <p className="col-md-3 col-sm-4 col-xs-6">Approval: {plat.is_approved ? 'Approved' : 'Not Approved'}</p>
                                <p className="col-md-3 col-sm-4 col-xs-6">Expansion Area: {plat.expansion_area}</p>
                                <p className="col-md-3 col-sm-4 col-xs-6">Slide: {plat.slide}</p>
                                <p className="col-md-3 col-sm-4 col-xs-6">Sewer Exactions: ${plat.sewer_due}</p>
                                <p className="col-md-3 col-sm-4 col-xs-6">Non-Sewer Exactions: ${plat.non_sewer_due}</p>
                            </div>
                        </div>
                    </div>
                );
            })(accounts.plat_account)
        ) : null;

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
                            {plats_list ? (
                                <div>
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
                                                {plats_list}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="row section-heading" role="tab" id="headingAccountPlats">
                                    <h2>Account Plats - None</h2>
                                </div>
                            )}
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

