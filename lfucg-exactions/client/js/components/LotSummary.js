import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Notes from './Notes';
import Uploads from './Uploads';

import PlatsMiniSummary from './PlatsMiniSummary';
import AccountsMiniSummary from './AccountsMiniSummary';
import AccountLedgersMiniSummary from './AccountLedgersMiniSummary';
import PaymentsMiniSummary from './PaymentsMiniSummary';

import FormGroup from './FormGroup';

import LoadingScreen from './LoadingScreen';
import {
    formUpdate,
} from '../actions/formActions';

import {
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
            lots,
            accounts,
            payments,
            accountLedgers,
            addPermitToLot,
        } = this.props;

        const lotExactions = !!lots && !!lots.currentLot && !!lots.currentLot.lot_exactions && lots.currentLot.lot_exactions.total_exactions && lots.currentLot.lot_exactions.total_exactions.replace(/\$|,/g, "");

        return (
            <div className="lot-summary">
                <Navbar />
                <div className="form-header">
                    <div className="container">
                        <h1>LOT SUMMARY - {!!lots.currentLot && lots.currentLot.address_full}</h1>
                    </div>
                </div>
                <Breadcrumbs route={this.props.route} parent_link={'lot'} parent_name={'Lots'} />

                <div className="inside-body">
                    {lots.loadingLot ? <LoadingScreen /> :
                    (
                        <div>
                            {!!lots.currentLot &&
                            <div>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-xs-10 col-xs-offset-1">
                                            {currentUser && currentUser.id && !lots.currentLot.permit_id &&
                                            <button type="button" className="btn pull-right button-modal-link" data-toggle="modal" data-target="#permitModal">
                                                <i className="fa fa-clipboard button-modal-icon" aria-hidden="true" />&nbsp;Add Permit ID
                                            </button>
                                            }
                                        </div>
                                    </div>
                                    <div className="modal fade" id="permitModal" role="alertdialog" aria-labelledby="modalLabel">
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                {lotExactions > 0 ? (
                                                    <div>
                                                        <div className="modal-header">
                                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" autoFocus><span aria-hidden="true">&times;</span></button>
                                                            <h3 className="modal-title text-center" id="modalLabel" tabIndex="0">Permit Addition</h3>
                                                        </div>
                                                        <div className="modal-body">
                                                            <h4 className="text-center" tabIndex="0">Records indicate an outstanding exactions balance of</h4>
                                                            <div className="row text-center alert alert-danger">
                                                                <h2 tabIndex="0"><strong>{!!lots.currentLot.lot_exactions && lots.currentLot.lot_exactions.total_exactions}</strong></h2>
                                                            </div>
                                                            <h4 className="text-center">for {lots.currentLot.address_full}.</h4>
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
                                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" autoFocus><span aria-hidden="true">&times;</span></button>
                                                                <h3 className="modal-title text-center" id="modalLabel" tabIndex="0">Permit Addition</h3>
                                                            </div>
                                                            <div className="modal-body">
                                                                <h4 className="text-center" tabIndex="0">Records indicate this lot has no exactions to be paid. You may enter a permit ID for:</h4>
                                                                <div className="row text-center alert alert-success">
                                                                    <h2 tabIndex="0"><strong>{lots.currentLot.address_full}</strong></h2> 
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
                                                    )}
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
                                                            {currentUser && currentUser.permissions && currentUser.permissions.lot && lots.currentLot &&
                                                                <Link to={`lot/form/${lots.currentLot.id}`} aria-label={`Edit ${lots.address_full}`}>
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
                                                <h3 className="col-xs-12 ">Current Exactions: {!!lots.currentLot.lot_exactions && lots.currentLot.lot_exactions.total_exactions}</h3>
                                                <p className="col-xs-12">Address: {lots.currentLot.address_full}</p>
                                                {!!lots.currentLot.alternative_address_street && <p className="col-xs-12">
                                                    Alternative Address: {lots.currentLot.alternative_address_number} {lots.currentLot.alternative_address_street}, Lexington KY
                                                </p>}
                                                <p className="col-md-4 col-xs-6">Lot Number: {lots.currentLot.lot_number}</p>
                                                <p className="col-md-4 col-xs-6 ">Permit ID: {lots.currentLot.permit_id}</p>
                                                <p className="col-md-4 col-xs-6">Latitude: {lots.currentLot.latitude}</p>
                                                <p className="col-md-4 col-xs-6">Longitude: {lots.currentLot.longitude}</p>
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
                                                            {currentUser && currentUser.permissions && currentUser.permissions.lot && lots.currentLot &&
                                                                <Link to={`lot/form/${lots.currentLot.id}`} aria-label={`Edit ${lots.address_full} lot exactions`}>
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
                                                    <h3 className="col-xs-12 ">Current Exactions: {!!lots.currentLot.lot_exactions && lots.currentLot.lot_exactions.total_exactions}</h3>
                                                    <p className="col-sm-6">Road Developer Exactions: {lots.currentLot.current_dues_roads_dev}</p>
                                                    <p className="col-sm-6">Road Owner Exactions: {lots.currentLot.current_dues_roads_own}</p>
                                                    <p className="col-sm-6">Sewer Transmission Developer Exactions: {lots.currentLot.current_dues_sewer_trans_dev}</p>
                                                    <p className="col-sm-6">Sewer Transmission Owner Exactions: {lots.currentLot.current_dues_sewer_trans_own}</p>
                                                    <p className="col-sm-6">Sewer Capacity Developer Exactions: {lots.currentLot.current_dues_sewer_cap_dev}</p>
                                                    <p className="col-sm-6">Sewer Capacity Owner Exactions: {lots.currentLot.current_dues_sewer_cap_own}</p>
                                                    <p className="col-sm-6">Parks Developer Exactions: {lots.currentLot.current_dues_parks_dev}</p>
                                                    <p className="col-sm-6">Parks Owner Exactions: {lots.currentLot.current_dues_parks_own}</p>
                                                    <p className="col-sm-6">Storm Developer Exactions: {lots.currentLot.current_dues_storm_dev}</p>
                                                    <p className="col-sm-6">Storm Owner Exactions: {lots.currentLot.current_dues_storm_own}</p>
                                                    <p className="col-sm-6">Open Space Developer Exactions: {lots.currentLot.current_dues_open_space_dev}</p>
                                                    <p className="col-sm-6">Open Space Owner Exactions: {lots.currentLot.current_dues_open_space_own}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {lots.currentLot.id &&
                                            <Notes
                                              content_type="plats_lot"
                                              object_id={lots.currentLot.id}
                                              ariaExpanded="false"
                                              panelClass="panel-collapse collapse row"
                                              permission="lot"
                                            />
                                        }

                                        <PlatsMiniSummary
                                          mapSet={lots.currentLot.plat}
                                          mapQualifier={!!lots.currentLot && !!lots.currentLot.plat}
                                          singlePlat
                                        />

                                        <AccountsMiniSummary
                                          mapSet={accounts && accounts.currentAccount}
                                          mapQualifier={!!accounts && !!accounts.currentAccount}
                                          singleAccount
                                          title="Developer Account"
                                          accordionID="Account"
                                        />

                                        <PaymentsMiniSummary
                                          mapSet={payments && payments.payments}
                                          mapQualifier={payments && payments.payments && payments.payments.length > 0}
                                          payments={payments}
                                        />

                                        <AccountLedgersMiniSummary
                                            mapSet={accountLedgers.accountLedgers}
                                            mapQualifier={accountLedgers && accountLedgers.accountLedgers && accountLedgers.accountLedgers.length > 0}
                                            accountLedgers={accountLedgers}
                                        />

                                        {lots.currentLot.id &&
                                            <Uploads
                                              file_content_type="plats_lot"
                                              file_object_id={lots.currentLot.id}
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
                    )}
                </div>
                <Footer />
            </div>
        );
    }
}

LotSummary.propTypes = {
    currentUser: PropTypes.object,
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
            dispatch(getLotID(selectedLot))
            .then((lot_data) => {
                if (lot_data.response.account) {
                    dispatch(getAccountID(lot_data.response.account));
                }
            });
            dispatch(getLotPayments(selectedLot));
            dispatch(getLotAccountLedgers(selectedLot))
            .then(() => {
                dispatch(formUpdate({ loading: false }));
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
