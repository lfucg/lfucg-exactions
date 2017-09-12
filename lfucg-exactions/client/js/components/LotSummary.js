import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Notes from './Notes';

import FormGroup from './FormGroup';


import {
    getPlatID,
    getLotID,
    getAccountID,
    getLotPayments,
    getLotAccountLedgers,
    putPermitIdOnLot,
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
            addPermitToLot,
        } = this.props;

        const payments_list = payments && payments.length > 0 &&
            map((payment) => {
                return (
                    <div key={payment.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <h3>Developer Account: {payment.credit_account.account_name}</h3>
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
                            <p className="col-sm-4 col-xs-6">Agreement Resolution: {payment.credit_source.resolution_number}</p>
                            <p className="col-sm-4 col-xs-6">Total Paid: {payment.total_paid}</p>
                            <p className="col-sm-4 col-xs-6">Payment Type: {payment.payment_type}</p>
                            <p className="col-sm-4 col-xs-6">Paid By: {payment.paid_by}</p>
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
                            <p className="col-sm-4 col-xs-6">Account From: {accountLedger.account_from.account_name}</p>
                            <p className="col-sm-4 col-xs-6">Account To: {accountLedger.account_to.account_name}</p>
                            <p className="col-sm-4 col-xs-6">Agreement Resolution: {accountLedger.agreement.resolution_number}</p>
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
                        <div className="row">
                            <div className="col-xs-10 col-xs-offset-1">
                                {currentUser && currentUser.id && !lots.permit_id &&
                                <button type="button" className="btn btn-lex btn-lg pull-right" data-toggle="modal" data-target="#permitModal">
                                    <i className="fa fa-clipboard" aria-hidden="true"></i>&nbsp;Add Permit ID
                                </button>
                                }
                            </div>
                        </div>
                        <div className="modal fade" id="permitModal" tabIndex="-1" role="dialog" aria-labelledby="modalLabel">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    {lots.total_due && lots.total_due > 0 ? (
                                        <div>
                                            <div className="modal-header">
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                                <h3 className="modal-title" id="modalLabel">Exactions due on this lot.</h3>
                                            </div>
                                            <div className="modal-body">
                                                <h4 className="text-center">Our records indicate an outstanding balance of <strong>${(lots.total_due).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</strong> for this lot. Please contact finance to submit payment prior to applying for a permit for:</h4>
                                                <h4 className="text-center">{lots.address_full}</h4>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                            </div>
                                        </div>
                                        ) : (
                                        <div>
                                            <div className="modal-header">
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                                <h2 className="modal-title text-center" id="modalLabel">Permit Request: {lots.address_full}</h2>
                                            </div>
                                            <div className="modal-body">
                                                <FormGroup label="Permit ID" id="permit_id">
                                                    <input type="text" className="form-control" placeholder="Please enter the Permit ID for this lot..." />
                                                </FormGroup>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-primary" onClick={addPermitToLot} data-dismiss="modal">Save</button>
                                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                            </div>
                                        </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
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
                                            <Notes content_type="Lot" object_id={lots.id} parent_content_type="Plat" parent_object_id={lots.plat.id} />
                                        }
                                    </div>
                                </div>
                            </div>

                            {lots.plat ? <div>
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
                                                        <Link to={`plat/form/${lots.plat.id}`} aria-label="Edit">
                                                            <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                            <div className="col-xs-7 link-label">
                                                                Edit
                                                            </div>
                                                        </Link>
                                                    }
                                                </div>
                                                <div className="col-xs-5 ">
                                                    <Link to={`plat/summary/${lots.plat.id}`} aria-label="Summary">
                                                        <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                                        <div className="col-xs-7 link-label">
                                                            Summary
                                                        </div>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xs-12">
                                            <p className="col-md-4 col-xs-6">Plat Name: {lots.plat.name}</p>
                                            <p className="col-md-4 col-xs-6">Expansion Area: {lots.plat.expansion_area}</p>
                                            <p className="col-md-4 col-xs-6">Slide: {lots.plat.slide}</p>
                                            <p className="col-md-4 col-xs-6">Buildable Lots: {lots.plat.buildable_lots}</p>
                                            <p className="col-md-4 col-xs-6">Non-Buildable Lots: {lots.plat.non_buildable_lots}</p>
                                            <p className="col-md-4 col-xs-6">Sewer Exactions: ${lots.plat.sewer_due}</p>
                                            <p className="col-md-4 col-xs-6">Non-Sewer Exactions: ${lots.plat.non_sewer_due}</p>
                                        </div>
                                    </div>
                                </div>
                            </div> : <div className="row section-heading" role="tab" id="headingAccountPayments">
                                <h2>Plat - None</h2>
                            </div>}

                            {lots.account && accounts ?
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
                                                <p>Developer Account Name: {accounts.account_name}</p>
                                                <p className="col-md-4 col-xs-6">{accounts.balance && accounts.balance.credit_availability}</p>
                                                {currentUser && currentUser.username &&
                                                    <div className="col-sm-6">
                                                        <p className="col-md-4 col-xs-6">Account Balance: {accounts.balance && accounts.balance.balance}</p>
                                                        <p className="col-md-4 col-xs-6">Contact Name: {accounts.contact_full_name}</p>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div> : <div className="row section-heading" role="tab" id="headingAccountPayments">
                                    <h2>Account - None</h2>
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
    addPermitToLot: PropTypes.func,
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
                if (lot_data.response.account) {
                    dispatch(getAccountID(lot_data.response.account));
                }
            });
        },
        addPermitToLot(event) {
            event.preventDefault();
            if (selectedLot) {
                dispatch(putPermitIdOnLot(selectedLot))
                .then(() => {
                    dispatch(getLotID(selectedLot));
                });
            }
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LotSummary);
