import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Notes from './Notes';

import {
    getLotID,
    getAccountID,
    getLotPayments,
    getLotAccountLedgers,
} from '../actions/apiActions';

// import {
//     formUpdate,
// } from '../actions/formActions';

class LotSummary extends React.Component {
    static propTypes = {
        currentUser: React.PropTypes.object,
        lots: React.PropTypes.object,
        accounts: React.PropTypes.object,
        payments: React.PropTypes.object,
        accountLedgers: React.PropTypes.object,
        route: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
    };

    componentDidMount() {
        this.props.onComponentDidMount();
    }


    render() {
        const {
            currentUser,
            lots,
            accounts,
            payments,
            accountLedgers,
        } = this.props;

        const payments_list = (payments && payments.length > 0) ? (
            map((payment) => {
                return (
                    <div key={payment.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <div className="col-sm-7 col-md-9">
                                <h3>Developer Account: {payment.credit_account.account_name}</h3>
                            </div>
                            <div className="col-sm-5 col-md-3">
                                <div className="col-xs-5">
                                    {currentUser && currentUser.permissions && currentUser.permissions.payment &&
                                        <Link to={`payment/form/${payment.id}`} className="btn btn-mid-level">
                                            Edit
                                        </Link>
                                    }
                                </div>
                                <div className="col-xs-5 col-xs-offset-1">
                                    <Link to={`payment/summary/${payment.id}`} className="btn btn-mid-level">
                                        Summary
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <p className="col-sm-4 col-xs-6">Agreement Resolution: {payment.credit_source.resolution_number}</p>
                            <p className="col-sm-4 col-xs-6">Payment Type: {payment.payment_type}</p>
                            <p className="col-sm-4 col-xs-6">Paid By: {payment.paid_by}</p>
                            <p className="col-sm-4 col-xs-6">Total Paid: {payment.total_paid}</p>
                        </div>
                    </div>
                );
            })(payments)
        ) : null;

        const account_ledgers_list = (accountLedgers && accountLedgers.length > 0) ? (
            map((accountLedger) => {
                return (
                    <div key={accountLedger.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <div className="col-sm-7 col-md-9">
                                <h3>{accountLedger.entry_type}</h3>
                            </div>
                            <div className="col-sm-5 col-md-3">
                                <div className="col-xs-5">
                                    {currentUser && currentUser.permissions && currentUser.permissions.accountledger &&
                                        <Link to={`account-ledger/form/${accountLedger.id}`} className="btn btn-mid-level">
                                            Edit
                                        </Link>
                                    }
                                </div>
                                <div className="col-xs-5 col-xs-offset-1">
                                    <Link to={`account-ledger/summary/${accountLedger.id}`} className="btn btn-mid-level">
                                        Summary
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <p className="col-sm-4 col-xs-6">Account From: {accountLedger.account_from.account_name}</p>
                            <p className="col-sm-4 col-xs-6">Account To: {accountLedger.account_to.account_name}</p>
                            <p className="col-sm-4 col-xs-6">Agreement Resolution: {accountLedger.agreement.resolution_number}</p>
                        </div>
                    </div>
                );
            })(accountLedgers)
        ) : null;

        return (
            <div className="lot-summary">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>LOTS - {lots.address_full}</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'lot'} parent_name={'Lots'} />

                <div className="inside-body">
                    <div className="container">
                        <div className="col-md-offset-1 col-md-10 panel-group" id="accordion" role="tablist" aria-multiselectable="false">
                            <a
                              role="button"
                              data-toggle="collapse"
                              data-parent="#accordion"
                              href="#collapseGeneralLot"
                              aria-expanded="false"
                              aria-controls="collapseGeneralLot"
                            >
                                <div className="row section-heading" role="tab" id="headingLot">
                                    <div className="col-xs-1 caret-indicator" />
                                    <div className="col-xs-10">
                                        <h2>General Lot Information</h2>
                                    </div>
                                </div>
                            </a>
                            <div
                              id="collapseGeneralLot"
                              className="panel-collapse collapse row"
                              role="tabpanel"
                              aria-labelledby="#headingLot"
                            >
                                <div className="panel-body">
                                    <div className="col-xs-12">
                                        <h3 className="col-xs-12 ">Total Exactions: {lots.total_due}</h3>
                                        <p className="col-md-8 col-xs-12">Address: {lots.address_full}</p>
                                        <p className="col-md-4 col-xs-6">Plat Name: {lots.plat ? lots.plat.name : null}</p>
                                        <p className="col-md-4 col-xs-6">Lot Number: {lots.lot_number}</p>
                                        <p className="col-md-4 col-xs-6 ">Permit ID: {lots.permit_id}</p>
                                        <p className="col-md-4 col-xs-6">Latitude: {lots.latitude}</p>
                                        <p className="col-md-4 col-xs-6">Longitude: {lots.longitude}</p>
                                        <p className="col-md-4 col-xs-6">Approved: {lots.is_approved ? 'Approved' : 'Not Approved'}</p>
                                    </div>
                                    {currentUser && currentUser.permissions && currentUser.permissions.lot &&
                                        <div className="col-md-offset-11 col-sm-offset-10 col-xs-offset-8">
                                            <Link to={`lot/form/${lots.id}`} role="link" >
                                                <h4>Edit</h4>
                                            </Link>
                                        </div>
                                    }
                                </div>
                            </div>

                            <a
                              role="button"
                              data-toggle="collapse"
                              data-parent="#accordion"
                              href="#collapseLotExactions"
                              aria-expanded="false"
                              aria-controls="collapseLotExactions"
                            >
                                <div className="row section-heading" role="tab" id="headingLotExactions">
                                    <div className="col-xs-1 caret-indicator" />
                                    <div className="col-xs-10">
                                        <h2>Lot Exactions</h2>
                                    </div>
                                </div>
                            </a>
                            <div
                              id="collapseLotExactions"
                              className="panel-collapse collapse row"
                              role="tabpanel"
                              aria-labelledby="#headingLotExactions"
                            >
                                <div className="panel-body">
                                    <div className="col-xs-12">
                                        <h3 className="col-xs-12 ">Total Exactions: {lots.total_due}</h3>
                                        <p className="col-sm-6">Road Developer Exactions: ${lots.dues_roads_dev}</p>
                                        <p className="col-sm-6">Road Owner Exactions: ${lots.dues_roads_own}</p>
                                        <p className="col-sm-6">Sewer Transmission Developer Exactions: ${lots.dues_sewer_trans_dev}</p>
                                        <p className="col-sm-6">Sewer Transmission Owner Exactions: ${lots.dues_sewer_trans_own}</p>
                                        <p className="col-sm-6">Sewer Capacity Developer Exactions: ${lots.dues_sewer_cap_dev}</p>
                                        <p className="col-sm-6">Sewer Capacity Owner Exactions: ${lots.dues_sewer_cap_own}</p>
                                        <p className="col-sm-6">Parks Developer Exactions: ${lots.dues_parks_dev}</p>
                                        <p className="col-sm-6">Parks Owner Exactions: ${lots.dues_parks_own}</p>
                                        <p className="col-sm-6">Storm Developer Exactions: ${lots.dues_storm_dev}</p>
                                        <p className="col-sm-6">Storm Owner Exactions: ${lots.dues_storm_own}</p>
                                        <p className="col-sm-6">Open Space Developer Exactions: ${lots.dues_open_space_dev}</p>
                                        <p className="col-sm-6">Open Space Owner Exactions: ${lots.dues_open_space_own}</p>
                                    </div>
                                    {currentUser && currentUser.permissions && currentUser.permissions.lot &&
                                        <div className="col-md-offset-11 col-sm-offset-10 col-xs-offset-8">
                                            <Link to={`lot/form/${lots.id}`} role="link" >
                                                <h4>Edit</h4>
                                            </Link>
                                        </div>
                                    }
                                </div>
                            </div>

                            <a
                              role="button"
                              data-toggle="collapse"
                              data-parent="#accordion"
                              href="#collapseNotes"
                              aria-expanded="false"
                              aria-controls="collapseNotes"
                            >
                                <div className="row section-heading" role="tab" id="headingNotes">
                                    <div className="col-xs-1 caret-indicator" />
                                    <div className="col-xs-8 col-xs-offset-1">
                                        <h2>Notes</h2>
                                    </div>
                                </div>
                            </a>
                            <div
                              id="collapseNotes"
                              className="panel-collapse collapse row"
                              role="tabpanel"
                              aria-labelledby="#headingNotes"
                            >
                                <div className="panel-body">
                                    <div className="col-xs-12">
                                        {lots.id &&
                                            <Notes content_type="Plat" object_id={lots.id} />
                                        }
                                    </div>
                                </div>
                            </div>

                            {lots.account && accounts &&
                                <div>
                                    <a
                                      role="button"
                                      data-toggle="collapse"
                                      data-parent="#accordion"
                                      href="#collapseAccounts"
                                      aria-expanded="false"
                                      aria-controls="collapseAccounts"
                                    >
                                        <div className="row section-heading" role="tab" id="headingAccount">
                                            <div className="col-xs-1 caret-indicator" />
                                            <div className="col-xs-10">
                                                <h2>Account</h2>
                                            </div>
                                        </div>
                                    </a>
                                    <div
                                      id="collapseAccounts"
                                      className="panel-collapse collapse row"
                                      role="tabpanel"
                                      aria-labelledby="#headingAccounts"
                                    >
                                        <div className="panel-body">
                                            <div className="col-xs-12">
                                                <div className="col-sm-6">
                                                    <p>Account Name: {accounts.account_name}</p>
                                                </div>
                                                <div className="col-sm-6">
                                                    <p>Contact Name: {accounts.contact_full_name}</p>
                                                </div>
                                            </div>
                                            <div className="col-md-offset-8 col-sm-offset-6">
                                                <div className="col-xs-6">
                                                    {currentUser && currentUser.permissions && currentUser.permissions.account &&
                                                        <Link to={`account/form/${accounts.id}`} role="link" >
                                                            <h4>Edit</h4>
                                                        </Link>
                                                    }
                                                </div>
                                                <div className="col-xs-6">
                                                    <Link to={`account/summary/${accounts.id}`} role="link" >
                                                        <h4>Summary</h4>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }

                            {payments_list ? (
                                <div>
                                    <a
                                      role="button"
                                      data-toggle="collapse"
                                      data-parent="#accordion"
                                      href="#collapseAccountPayments"
                                      aria-expanded="false"
                                      aria-controls="collapseAccountPayments"
                                    >
                                        <div className="row section-heading" role="tab" id="headingAccountPayments">
                                            <div className="col-xs-1 caret-indicator" />
                                            <div className="col-xs-10">
                                                <h2>Payments</h2>
                                            </div>
                                        </div>
                                    </a>
                                    <div
                                      id="collapseAccountPayments"
                                      className="panel-collapse collapse row"
                                      role="tabpanel"
                                      aria-labelledby="#headingAccountPayments"
                                    >
                                        <div className="panel-body">
                                            <div className="col-xs-12">
                                                {payments_list}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="row section-heading" role="tab" id="headingAccountPayments">
                                    <h2>Payments - None</h2>
                                </div>
                            )}

                            {account_ledgers_list ? (
                                <div>
                                    <a
                                      role="button"
                                      data-toggle="collapse"
                                      data-parent="#accordion"
                                      href="#collapseAccountLedgers"
                                      aria-expanded="false"
                                      aria-controls="collapseAccountLedgers"
                                    >
                                        <div className="row section-heading" role="tab" id="headingAccountLedgers">
                                            <div className="col-xs-1 caret-indicator" />
                                            <div className="col-xs-10">
                                                <h2>Account Ledgers</h2>
                                            </div>
                                        </div>
                                    </a>
                                    <div
                                      id="collapseAccountLedgers"
                                      className="panel-collapse collapse row"
                                      role="tabpanel"
                                      aria-labelledby="#headingAccountLedgers"
                                    >
                                        <div className="panel-body">
                                            <div className="col-xs-12">
                                                {account_ledgers_list}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="row section-heading" role="tab" id="headingAccountLedgers">
                                    <h2>Account Ledgers - None</h2>
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
        currentUser: state.currentUser,
        lots: state.lots,
        accounts: state.accounts,
        payments: state.payments,
        accountLedgers: state.accountLedgers,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedLot = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(getLotPayments(selectedLot));
            dispatch(getLotAccountLedgers(selectedLot));
            dispatch(getLotID(selectedLot))
            .then((lot_data) => {
                if (lot_data.response.account) {
                    dispatch(getAccountID(lot_data.response.account));
                }
            });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LotSummary);
