import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Notes from './Notes';
import Uploads from './Uploads';

import LotsMiniSummary from './LotsMiniSummary';
import AccountsMiniSummary from './AccountsMiniSummary';
import LoadingScreen from './LoadingScreen';

import {
    formUpdate,
} from '../actions/formActions';

import {
    getPlatID,
    getPlatLots,
    getAccountID,
} from '../actions/apiActions';

class PlatSummary extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }


    render() {
        const {
            currentUser,
            plats,
            lots,
            accounts,
        } = this.props;

        const platZonesList = !!plats && !!plats.currentPlat && plats.currentPlat.plat_zone && (map((single_plat_zone) => {
            return (
                <div key={single_plat_zone.id} className="col-xs-12">
                    <div className="row form-subheading">
                        <h3>{single_plat_zone.zone}</h3>
                    </div>
                    <div className="row">
                        <div className="col-sm-offset-1">
                            <p className="col-sm-4 col-xs-6">Zone: {single_plat_zone.zone}</p>
                            <p className="col-sm-4 col-xs-6">Gross Acreage: {single_plat_zone.cleaned_acres}</p>
                        </div>
                    </div>
                </div>
            );
        })(plats.currentPlat.plat_zone));

        const platZoneExactions = !!plats && !!plats.currentPlat && plats.currentPlat.plat_zone && (map((plat_exaction) => {
            return (
                <div key={plat_exaction.id}>
                    <div className="col-xs-4">
                        <div className="row table-border">
                            <h4 className="table-data">{plat_exaction.zone}</h4>
                        </div>
                        <div className="row table-border">
                            <p className="table-data">{plat_exaction.cleaned_acres}</p>
                        </div>
                        <div className="row table-border">
                            <p className="table-data">{plat_exaction.dollar_values && plat_exaction.dollar_values.dollar_roads}</p>
                        </div>
                        <div className="row table-border">
                            <p className="table-data">{plat_exaction.dollar_values && plat_exaction.dollar_values.dollar_open_spaces}</p>
                        </div>
                        <div className="row table-border">
                            <p className="table-data">{plat_exaction.dollar_values && plat_exaction.dollar_values.dollar_sewer_cap}</p>
                        </div>
                        <div className="row table-border">
                            <p className="table-data">{plat_exaction.dollar_values && plat_exaction.dollar_values.dollar_sewer_trans}</p>
                        </div>
                        <div className="row table-border">
                            <p className="table-data">{plat_exaction.dollar_values && plat_exaction.dollar_values.dollar_parks}</p>
                        </div>
                        <div className="row table-border">
                            <p className="table-data">{plat_exaction.dollar_values && plat_exaction.dollar_values.dollar_storm_water}</p>
                        </div>
                    </div>
                </div>
            );
        })(plats.currentPlat.plat_zone));

        return (
            <div className="plat-summary">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>PLAT SUMMARY - {!!plats && !!plats.currentPlat && plats.currentPlat.cabinet}-{!!plats && !!plats.currentPlat && plats.currentPlat.slide}</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'plat'} parent_name={'Plats'} />

                <div className="inside-body">
                    <div className="container">
                        {!!plats && plats.loadingPlat ? <LoadingScreen /> :
                        (
                            <div className="col-md-offset-1 col-md-10 panel-group" id="accordion" role="tablist" aria-multiselectable="false">
                                {!!plats && !!plats.currentPlat && <div>
                                <a
                                  role="button"
                                  data-toggle="collapse"
                                  data-parent="#accordion"
                                  href="#collapseGeneralPlat"
                                  aria-expanded="false"
                                  aria-controls="collapseGeneralPlat"
                                >
                                    <div className="row section-heading" role="tab" id="headingPlat">
                                        <div className="col-xs-1 caret-indicator" />
                                        <div className="col-xs-10">
                                            <h3>General Plat Information</h3>
                                        </div>
                                    </div>
                                </a>
                                <div
                                  id="collapseGeneralPlat"
                                  className="panel-collapse collapse row"
                                  role="tabpanel"
                                  aria-labelledby="#headingPlat"
                                >
                                    <div className="panel-body">
                                        <div className="row link-row">
                                            <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                                                <div className="col-xs-5 col-xs-offset-5">
                                                    {currentUser && currentUser.permissions && currentUser.permissions.plat &&
                                                        <Link to={`plat/form/${plats.currentPlat.id}`} aria-label={`Edit ${plats.currentPlat.cabinet} ${plats.currentPlat.slide}`}>
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
                                            <h3 className="col-xs-6">Plat: {plats.currentPlat.cabinet}-{plats.currentPlat.slide}</h3>
                                            <h3 className="col-xs-6">{plats.currentPlat.is_approved ? 'Approved' : 'Not Approved'}</h3>
                                            <p className="col-xs-6">Name: {plats.currentPlat.name}</p>
                                            <p className="col-xs-6">Subdivision: {plats.currentPlat.subdivision ? plats.currentPlat.subdivision.name : null}</p>
                                            <p className="col-xs-6">Plat Type: {plats.currentPlat.plat_type_display}</p>
                                            <p className="col-xs-6">Expansion Area: {plats.currentPlat.expansion_area}</p>
                                            <p className="col-xs-6">Gross Acreage: {plats.currentPlat.cleaned_total_acreage}</p>
                                            <p className="col-xs-6">Unit: {plats.currentPlat.unit}</p>
                                            <p className="col-xs-6">Section: {plats.currentPlat.section}</p>
                                            <p className="col-xs-6">Block: {plats.currentPlat.block}</p>
                                            <p className="col-xs-6">Buildable Lots: {plats.currentPlat.buildable_lots}</p>
                                            <p className="col-xs-6">Non-Buildable Lots: {plats.currentPlat.non_buildable_lots}</p>
                                            <p className="col-xs-6">Current Sewer Due: {plats.currentPlat.current_sewer_due}</p>
                                            <p className="col-xs-6">Current Non-Sewer Due: {plats.currentPlat.current_non_sewer_due}</p>
                                            <p className="col-xs-12">Calculation Note: {plats.currentPlat.calculation_note}</p>
                                        </div>
                                    </div>
                                </div>

                                { platZonesList && <div>
                                    <a
                                      role="button"
                                      data-toggle="collapse"
                                      data-parent="#accordion"
                                      href="#collapsePlatZones"
                                      aria-expanded="false"
                                      aria-controls="collapsePlatZones"
                                    >
                                        <div className="row section-heading" role="tab" id="headingPlatZone">
                                            <div className="col-xs-1 caret-indicator" />
                                            <div className="col-xs-10">
                                                <h3>Plat Zones</h3>
                                            </div>
                                        </div>
                                    </a>
                                    <div
                                      id="collapsePlatZones"
                                      className="panel-collapse collapse row"
                                      role="tabpanel"
                                      aria-labelledby="#headingPlatZone"
                                    >
                                        <div className="panel-body">
                                            <div className="row link-row">
                                                <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                                                    <div className="col-xs-5 col-xs-offset-5">
                                                        {currentUser && currentUser.permissions && currentUser.permissions.plat &&
                                                            <Link to={`plat/form/${plats.currentPlat.id}`} aria-label="Edit plat zones">
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
                                                <div className="col-xs-12">
                                                    { platZonesList }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>}

                                { !!plats.currentPlat && plats.currentPlat.plat_zone &&
                                    <div>
                                        <a
                                          role="button"
                                          data-toggle="collapse"
                                          data-parent="#accordion"
                                          href="#collapsePlatExactions"
                                          aria-expanded="false"
                                          aria-controls="collapsePlatExactions"
                                        >
                                            <div className="row section-heading" role="tab" id="headingPlatExactions">
                                                <div className="col-xs-1 caret-indicator" />
                                                <div className="col-xs-10">
                                                    <h3>Plat Exactions</h3>
                                                </div>
                                            </div>
                                        </a>
                                        <div
                                          id="collapsePlatExactions"
                                          className="panel-collapse collapse row"
                                          role="tabpanel"
                                          aria-labelledby="#headingPlatExactions"
                                        >
                                            <div className="panel-body">
                                                <div className="row link-row">
                                                    <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                                                        <div className="col-xs-5 col-xs-offset-5">
                                                            {currentUser && currentUser.permissions && currentUser.permissions.plat &&
                                                                <Link to={`plat/form/${plats.currentPlat.id}`} aria-label={`Edit ${plats.currentPlat.cabinet} ${plats.currentPlat.slide} plat exactions`}>
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
                                                    <div className="col-xs-12">
                                                        <div className="col-xs-6 col-sm-5 col-md-3">
                                                            <div className="col-xs-12 table-border">
                                                                <h4>Zone</h4>
                                                            </div>
                                                            <div className="col-xs-12 table-border">
                                                                <p>Gross Acreage</p>
                                                            </div>
                                                            <div className="col-xs-12 table-border">
                                                                <p>Roads</p>
                                                            </div>
                                                            <div className="col-xs-12 table-border">
                                                                <p>Open Space</p>
                                                            </div>
                                                            <div className="col-xs-12 table-border">
                                                                <p>Sewer Capacity</p>
                                                            </div>
                                                            <div className="col-xs-12 table-border">
                                                                <p>Sewer Trans.</p>
                                                            </div>
                                                            <div className="col-xs-12 table-border">
                                                                <p>Parks</p>
                                                            </div>
                                                            <div className="col-xs-12 table-border">
                                                                <p>Storm Water</p>
                                                            </div>
                                                        </div>
                                                        <div className="col-xs-6 col-sm-7 col-md-9">
                                                            {platZoneExactions}
                                                        </div>
                                                    </div>
                                                    <div className="col-xs-12">
                                                        <div className="row">
                                                            <h3>Plat Exactions</h3>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-xs-6 text-center">
                                                                <p>Sewer Dues: {plats.currentPlat.current_sewer_due}</p>
                                                            </div>
                                                            <div className="col-xs-6 text-center">
                                                                <p>Non-Sewer Dues: {plats.currentPlat.current_non_sewer_due}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xs-12">
                                                    <h4>Calculation Notes:</h4>
                                                    <div className="col-xs-12">
                                                        <p>{plats.currentPlat.calculation_note}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                {!!plats.currentPlat && plats.currentPlat.id &&
                                    <Notes
                                      content_type="plats_plat"
                                      object_id={plats.currentPlat.id}
                                      ariaExpanded="false"
                                      panelClass="panel-collapse collapse row"
                                      permission="plat"
                                    />
                                }

                                <LotsMiniSummary
                                  mapSet={lots.lots}
                                  mapQualifier={lots && lots.lots && lots.lots.length > 0}
                                  lots={lots}
                                />

                                <AccountsMiniSummary
                                  mapSet={!!accounts && accounts.accounts}
                                  mapQualifier={!!plats.currentPlat && plats.currentPlat.account && accounts.accounts}
                                  singleAccount
                                  title="Developer Account"
                                  accordionID="Account"
                                />

                                {!!plats.currentPlat && plats.currentPlat.id &&
                                    <Uploads
                                      file_content_type="plats_plat"
                                      file_object_id={plats.currentPlat.id}
                                      ariaExpanded="false"
                                      panelClass="panel-collapse collapse row"
                                      permission="plat"
                                    />
                                }
                                </div>}
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

PlatSummary.propTypes = {
    currentUser: PropTypes.object,
    plats: PropTypes.array,
    lots: PropTypes.array,
    accounts: PropTypes.array,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        plats: state.plats,
        lots: state.lots,
        accounts: state.accounts,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedPlat = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(getPlatLots(selectedPlat));
            dispatch(getPlatID(selectedPlat))
            .then((plat_data) => {
                if (plat_data.response.account) {
                    dispatch(getAccountID(plat_data.response.account));
                }
                dispatch(formUpdate({ loading: false }));
            });
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(PlatSummary);
