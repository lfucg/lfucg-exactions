import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Notes from './Notes';

import {
    getPlatID,
    getLotID,
    getAccountID,
    getLotPayments,
    getLotAccountLedgers,
} from '../actions/apiActions';

class LotSummary extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }


    render() {
        const {
            currentUser,
            plats,
            lots,
            accounts,
            payments,
            accountLedgers,
        } = this.props;

        const payments_list = payments && payments.length > 0 &&
            map((payment) => {
                return (
                    <div key={payment.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <h3>Paid By {payment.paid_by}</h3>
                        </div>
                        <div className="row link-row">
                            <div className="col-xs-12 col-sm-5 col-md-3 col-sm-offset-7 col-md-offset-9">
                                <div className="col-xs-5">
                                    {currentUser && currentUser.permissions && currentUser.permissions.payment &&
                                        <Link to={`payment/form/${payment.id}`} aria-label="Edit">
                                            <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                            <div className="col-xs-7 link-label">
                                                Edit
                                            </div>
                                        </Link>
                                    }
                                </div>
                                <div className="col-xs-5 ">
                                    <Link to={`payment/summary/${payment.id}`} aria-label="Summary">
                                        <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                        <div className="col-xs-7 link-label">
                                            Summary
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <p className="col-md-3 col-sm-4 col-xs-6">Total Paid: {payment.total_paid}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Payment Type: {payment.payment_type}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Paid By Type: {payment.paid_by_type}</p>
                        </div>
                    </div>
                );
            })(payments);

        const account_ledgers_list = accountLedgers && accountLedgers.length > 0 &&
            map((accountLedger) => {
                return (
                    <div key={accountLedger.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <h3>{accountLedger.entry_date}</h3>
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
                            <p className="col-md-3 col-sm-4 col-xs-6">Entry Type: {accountLedger.entry_type_display}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Non-Sewer Credits: {accountLedger.non_sewer_credits}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Sewer Credits: {accountLedger.sewer_credits}</p>
                        </div>
                    </div>
                );
            })(accountLedgers);

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
                                    <div className="row link-row">
                                        <div className="col-xs-12 col-sm-5 col-md-3 col-sm-offset-7 col-md-offset-9">
                                            <div className="col-xs-5 col-xs-offset-5">
                                                {currentUser && currentUser.permissions && currentUser.permissions.lot &&
                                                    <Link to={`lot/form/${lots.id}`} aria-label="Edit">
                                                        <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                        <div className="col-xs-7 link-label">
                                                            Edit
                                                        </div>
                                                    </Link>
                                                }
                                            </div>
                                        </div>
                                    </div>
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
                                    <div className="row link-row">
                                        <div className="col-xs-12 col-sm-5 col-md-3 col-sm-offset-7 col-md-offset-9">
                                            <div className="col-xs-5 col-xs-offset-5">
                                                {currentUser && currentUser.permissions && currentUser.permissions.lot &&
                                                    <Link to={`lot/form/${lots.id}`} aria-label="Edit">
                                                        <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                        <div className="col-xs-7 link-label">
                                                            Edit
                                                        </div>
                                                    </Link>
                                                }
                                            </div>
                                        </div>
                                    </div>
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
                                            <Notes content_type="Lot" object_id={lots.id} parent_content_type="Plat" parent_object_id={lots.plat} />
                                        }
                                    </div>
                                </div>
                            </div>

                            <a
                              role="button"
                              data-toggle="collapse"
                              data-parent="#accordion"
                              href="#collapsePlat"
                              aria-expanded="false"
                              aria-controls="collapsePlat"
                            >
                                <div className="row section-heading" role="tab" id="headingPlat">
                                    <div className="col-xs-1 caret-indicator" />
                                    <div className="col-xs-10">
                                        <h2>Plat Information</h2>
                                    </div>
                                </div>
                            </a>
                            <div
                              id="collapsePlat"
                              className="panel-collapse collapse row"
                              role="tabpanel"
                              aria-labelledby="#headingPlat"
                            >
                                <div className="panel-body">
                                    <div className="row link-row">
                                        <div className="col-xs-12 col-sm-5 col-md-3 col-sm-offset-7 col-md-offset-9">
                                            <div className="col-xs-5">
                                                {currentUser && currentUser.permissions && currentUser.permissions.plat &&
                                                    <Link to={`plat/form/${plats.id}`} aria-label="Edit">
                                                        <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                        <div className="col-xs-7 link-label">
                                                            Edit
                                                        </div>
                                                    </Link>
                                                }
                                            </div>
                                            <div className="col-xs-5 ">
                                                <Link to={`plat/summary/${plats.id}`} aria-label="Summary">
                                                    <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                                    <div className="col-xs-7 link-label">
                                                        Summary
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12">
                                        <p className="col-md-4 col-xs-6">Plat Name: {plats.name}</p>
                                        <p className="col-md-4 col-xs-6">Expansion Area: {plats.expansion_area}</p>
                                        <p className="col-md-4 col-xs-6">Slide: {plats.slide}</p>
                                        <p className="col-md-4 col-xs-6">Buildable Lots: {plats.buildable_lots}</p>
                                        <p className="col-md-4 col-xs-6">Non-Buildable Lots: {plats.non_buildable_lots}</p>
                                        <p className="col-md-4 col-xs-6">Sewer Exactions: ${plats.sewer_due}</p>
                                        <p className="col-md-4 col-xs-6">Non-Sewer Exactions: ${plats.non_sewer_due}</p>
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
                                                <h2>Developer Account</h2>
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
                                            <div className="row link-row">
                                                <div className="col-xs-12 col-sm-5 col-md-3 col-sm-offset-7 col-md-offset-9">
                                                    <div className="col-xs-5">
                                                        {currentUser && currentUser.permissions && currentUser.permissions.account &&
                                                            <Link to={`account/form/${accounts.id}`} aria-label="Edit">
                                                                <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                                <div className="col-xs-7 link-label">
                                                                    Edit
                                                                </div>
                                                            </Link>
                                                        }
                                                    </div>
                                                    <div className="col-xs-5 ">
                                                        <Link to={`account/summary/${accounts.id}`} aria-label="Summary">
                                                            <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                                            <div className="col-xs-7 link-label">
                                                                Summary
                                                            </div>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xs-12">
                                                <div className="col-sm-6">
                                                    <p>Developer Account Name: {accounts.account_name}</p>
                                                </div>
                                                {currentUser && currentUser.username &&
                                                    <div className="col-sm-6">
                                                        <p>Contact Name: {accounts.contact_full_name}</p>
                                                    </div>
                                                }
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

LotSummary.propTypes = {
    currentUser: PropTypes.object,
    plats: PropTypes.object,
    lots: PropTypes.object,
    accounts: PropTypes.object,
    payments: PropTypes.object,
    accountLedgers: PropTypes.object,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        plats: state.plats,
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
                if (lot_data.response.plat) {
                    dispatch(getPlatID(lot_data.response.plat));
                }
                if (lot_data.response.account) {
                    dispatch(getAccountID(lot_data.response.account));
                }
            });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LotSummary);
