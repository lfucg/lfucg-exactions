import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map, filter, compose } from 'ramda';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Notes from './Notes';
import Uploads from './Uploads';

import FormGroup from './FormGroup';


import {
    getPlatID,
    getLotID,
    getLots,
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
            selectedLot,
        } = this.props;

        const currentLot = lots && lots.length > 0 &&
            filter(lot => lot.id === parseInt(selectedLot, 10))(lots)[0];

        const payments_list = payments && payments.length > 0 &&
            map((payment) => {
                return (
                    <div key={payment.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <h3>Developer Account: {payment.credit_account.account_name}</h3>
                        </div>
                        <div className="row link-row">
                            <div className="col-xs-12 col-sm-5 col-sm-offset-7">
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
                            <p className="col-xs-6">Agreement Resolution: {payment.credit_source && payment.credit_source.resolution_number}</p>
                            <p className="col-xs-6">Total Paid: {payment.total_paid}</p>
                            <p className="col-xs-6">Paid By: {payment.paid_by}</p>
                            <p className="col-xs-6">Payment Type: {payment.payment_type_display}</p>
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
                            <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                                <div className="col-xs-5">
                                    {currentUser && currentUser.permissions && currentUser.permissions.accountledger &&
                                        <Link to={`credit-transfer/form/${accountLedger.id}`} aria-label="Edit">
                                            <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                            <div className="col-xs-7 link-label">
                                                Edit
                                            </div>
                                        </Link>
                                    }
                                </div>
                                <div className="col-xs-5 ">
                                    <Link to={`credit-transfer/summary/${accountLedger.id}`} aria-label="Summary">
                                        <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                        <div className="col-xs-7 link-label">
                                            Summary
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <p className="col-xs-6">Entry Type: {accountLedger.entry_type_display}</p>
                            <p className="col-xs-6">Agreement Resolution: {accountLedger.agreement.resolution_number}</p>
                            <p className="col-xs-6">Account From: {accountLedger.account_from.account_name}</p>
                            <p className="col-xs-6">Account To: {accountLedger.account_to.account_name}</p>
                            <p className="col-xs-6">Non-Sewer Credits: {accountLedger.dollar_values && accountLedger.dollar_values.dollar_non_sewer}</p>
                            <p className="col-xs-6">Sewer Credits: {accountLedger.dollar_values && accountLedger.dollar_values.dollar_sewer}</p>
                        </div>
                    </div>
                );
            })(accountLedgers);

        return (
            <div className="lot-summary">
                <Navbar />
                <div className="form-header">
                    <div className="container">
                        <h1>LOTS - {currentLot && currentLot.address_full}</h1>
                    </div>
                </div>
                <Breadcrumbs route={this.props.route} parent_link={'lot'} parent_name={'Lots'} />

                <div className="inside-body">
                    {currentLot &&
                    <div>
                        <div className="container">
                            <div className="row">
                                <div className="col-xs-10 col-xs-offset-1">
                                    {currentUser && currentUser.id && !currentLot.permit_id &&
                                    <button type="button" className="btn pull-right button-modal-link" data-toggle="modal" data-target="#permitModal">
                                        <i className="fa fa-clipboard button-modal-icon" aria-hidden="true" />&nbsp;Add Permit ID
                                    </button>
                                    }
                                </div>
                            </div>
                            <div className="modal fade" id="permitModal" tabIndex="-1" role="dialog" aria-labelledby="modalLabel">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        {currentLot.lot_exactions && currentLot.lot_exactions.current_exactions_number > 0 ? (
                                            <div>
                                                <div className="modal-header">
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                                    <h3 className="modal-title text-center" id="modalLabel">Permit Addition</h3>
                                                </div>
                                                <div className="modal-body">
                                                    <h4 className="text-center">Records indicate an outstanding exactions balance of</h4>
                                                    <div className="row text-center alert alert-danger">
                                                        <h2><strong>{currentLot.lot_exactions.current_exactions}</strong></h2>
                                                    </div>
                                                    <h4 className="text-center">for {currentLot.address_full}.</h4>
                                                    <div className="row">
                                                        <div className="text-center col-sm-4 col-sm-offset-4 col-xs-12">
                                                            <FormGroup label="Enter Permit ID" id="permit_id">
                                                                <input type="text" className="form-control" placeholder="Permit ID" />
                                                            </FormGroup>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-primary" onClick={addPermitToLot} data-dismiss="modal">Save</button>
                                                    <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                                </div>
                                            </div>
                                            ) : (
                                                <div>
                                                    <div className="modal-header">
                                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                                        <h3 className="modal-title text-center" id="modalLabel">Permit Addition</h3>
                                                    </div>
                                                    <div className="modal-body">
                                                        <h4 className="text-center">Records indicate this lot has no exactions to be paid. You may enter a permit ID for:</h4>
                                                        <div className="row text-center alert alert-success">
                                                            <h2><strong>{currentLot.address_full}</strong></h2>
                                                        </div>
                                                        <div className="row">
                                                            <div className="text-center col-sm-4 col-sm-offset-4 col-xs-12">
                                                                <FormGroup label="Enter Permit ID" id="permit_id">
                                                                    <input type="text" className="form-control" placeholder="Permit ID" />
                                                                </FormGroup>
                                                            </div>
                                                        </div>
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
                                            <h3>General Lot Information</h3>
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
                                            <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                                                <div className="col-xs-5 col-xs-offset-5">
                                                    {currentUser && currentUser.permissions && currentUser.permissions.lot && currentLot &&
                                                        <Link to={`lot/form/${currentLot.id}`} aria-label="Edit">
                                                            <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                            <div className="col-xs-7 link-label">
                                                                Edit
                                                            </div>
                                                        </Link>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12">
                                        <h3 className="col-xs-12 ">Current Exactions: {currentLot.lot_exactions && currentLot.lot_exactions.current_exactions}</h3>
                                        <p className="col-md-8 col-xs-12">Address: {currentLot.address_full}</p>
                                        <p className="col-md-4 col-xs-6">Lot Number: {currentLot.lot_number}</p>
                                        <p className="col-md-4 col-xs-6 ">Permit ID: {currentLot.permit_id}</p>
                                        <p className="col-md-4 col-xs-6">Latitude: {currentLot.latitude}</p>
                                        <p className="col-md-4 col-xs-6">Longitude: {currentLot.longitude}</p>
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
                                            <h3>Lot Exactions</h3>
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
                                            <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                                                <div className="col-xs-5 col-xs-offset-5">
                                                    {currentUser && currentUser.permissions && currentUser.permissions.lot && currentLot &&
                                                        <Link to={`lot/form/${currentLot.id}`} aria-label="Edit">
                                                            <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                            <div className="col-xs-7 link-label">
                                                                Edit
                                                            </div>
                                                        </Link>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        {currentLot.lot_exactions &&
                                            <div className="col-xs-12">
                                                <h3 className="col-xs-12 ">Current Exactions: {currentLot.lot_exactions.current_exactions}</h3>
                                                <p className="col-sm-6">Road Developer Exactions: {currentLot.lot_exactions.dues_roads_dev}</p>
                                                <p className="col-sm-6">Road Owner Exactions: {currentLot.lot_exactions.dues_roads_own}</p>
                                                <p className="col-sm-6">Sewer Transmission Developer Exactions: {currentLot.lot_exactions.dues_sewer_trans_dev}</p>
                                                <p className="col-sm-6">Sewer Transmission Owner Exactions: {currentLot.lot_exactions.dues_sewer_trans_own}</p>
                                                <p className="col-sm-6">Sewer Capacity Developer Exactions: {currentLot.lot_exactions.dues_sewer_cap_dev}</p>
                                                <p className="col-sm-6">Sewer Capacity Owner Exactions: {currentLot.lot_exactions.dues_sewer_cap_own}</p>
                                                <p className="col-sm-6">Parks Developer Exactions: {currentLot.lot_exactions.dues_parks_dev}</p>
                                                <p className="col-sm-6">Parks Owner Exactions: {currentLot.lot_exactions.dues_parks_own}</p>
                                                <p className="col-sm-6">Storm Developer Exactions: {currentLot.lot_exactions.dues_storm_dev}</p>
                                                <p className="col-sm-6">Storm Owner Exactions: {currentLot.lot_exactions.dues_storm_own}</p>
                                                <p className="col-sm-6">Open Space Developer Exactions: {currentLot.lot_exactions.dues_open_space_dev}</p>
                                                <p className="col-sm-6">Open Space Owner Exactions: {currentLot.lot_exactions.dues_open_space_own}</p>
                                            </div>
                                        }
                                    </div>
                                </div>
                                {currentLot.id &&
                                    <Notes
                                      content_type="plats_lot"
                                      object_id={currentLot.id}
                                      ariaExpanded="false"
                                      panelClass="panel-collapse collapse row"
                                      permission="lot"
                                    />
                                }

                                {currentLot.plat ? <div>
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
                                                <h3>Plat Information</h3>
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
                                                <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                                                    <div className="col-xs-5">
                                                        {currentUser && currentUser.permissions && currentUser.permissions.plat &&
                                                            <Link to={`plat/form/${currentLot.plat.id}`} aria-label="Edit">
                                                                <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                                <div className="col-xs-7 link-label">
                                                                    Edit
                                                                </div>
                                                            </Link>
                                                        }
                                                    </div>
                                                    <div className="col-xs-5 ">
                                                        <Link to={`plat/summary/${currentLot.plat.id}`} aria-label="Summary">
                                                            <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                                            <div className="col-xs-7 link-label">
                                                                Summary
                                                            </div>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xs-12">
                                                <h3 className="col-xs-12">Plat: {currentLot.plat.cabinet}-{currentLot.plat.slide}</h3>
                                                <p className="col-xs-6">Expansion Area: {currentLot.plat.expansion_area}</p>
                                                <p className="col-xs-6">Gross Acreage: {currentLot.plat.cleaned_total_acreage}</p>
                                                <p className="col-xs-6">Buildable Lots: {currentLot.plat.buildable_lots}</p>
                                                <p className="col-xs-6">Non-Buildable Lots: {currentLot.plat.non_buildable_lots}</p>
                                                <p className="col-sm-6 col-xs-12">Sewer Exactions: {currentLot.plat.plat_exactions && currentLot.plat.plat_exactions.plat_sewer_due}</p>
                                                <p className="col-sm-6 col-xs-12">Non-Sewer Exactions: {currentLot.plat.plat_exactions && currentLot.plat.plat_exactions.plat_non_sewer_due}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div> : <div className="row section-heading" role="tab" id="headingAccountPayments">
                                    <h3>Plat - None</h3>
                                </div>}

                                {currentLot.account && accounts ?
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
                                                    <h3>Developer Account</h3>
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
                                                    <div className="col-xs-12 col-sm-5 col-sm-offset-7">
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
                                                    <p className="col-xs-6">Developer Account Name: {accounts.account_name}</p>
                                                    <p className="col-xs-6"><strong>{accounts.balance && accounts.balance.credit_availability}</strong></p>
                                                    {currentUser && currentUser.username &&
                                                        <div>
                                                            <p className="col-xs-6">Account Balance: {accounts.balance && accounts.balance.balance}</p>
                                                            <p className="col-xs-6">Contact Name: {accounts.contact_full_name}</p>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div> : <div className="row section-heading" role="tab" id="headingAccountPayments">
                                        <h3>Account - None</h3>
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
                                                    <h3>Payments</h3>
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
                                        <h3>Payments - None</h3>
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
                                                    <h3>Credit Transfers</h3>
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
                                        <h3>Credit Transfers - None</h3>
                                    </div>
                                )}
                                {currentLot.id &&
                                    <Uploads
                                      file_content_type="plats_lot"
                                      file_object_id={currentLot.id}
                                      ariaExpanded="false"
                                      panelClass="panel-collapse collapse row"
                                      permission="lot"
                                    />
                                }
                            </div>
                        </div>
                    </div>
                    }
                </div>
                <Footer />
            </div>
        );
    }
}

LotSummary.propTypes = {
    currentUser: PropTypes.object,
    plats: PropTypes.array,
    lots: PropTypes.array,
    accounts: PropTypes.array,
    payments: PropTypes.array,
    accountLedgers: PropTypes.array,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
    addPermitToLot: PropTypes.func,
    selectedLot: PropTypes.string,
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
            dispatch(getLots());
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
                dispatch(putPermitIdOnLot(selectedLot));
                dispatch(getLots());
                dispatch(getLotID(selectedLot));
            }
        },
        selectedLot,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LotSummary);
