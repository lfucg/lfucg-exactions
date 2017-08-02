import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Notes from './Notes';

import {
    getPlatID,
} from '../actions/apiActions';

import {
    formUpdate,
} from '../actions/formActions';

class PlatExisting extends React.Component {
    static propTypes = {
        plats: React.PropTypes.object,
        route: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
    };

    componentDidMount() {
        this.props.onComponentDidMount();
    }


    render() {
        const {
            plats,
        } = this.props;

        const platZonesList = plats.plat_zone && (map((single_plat_zone) => {
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
        })(plats.plat_zone));

        const platZoneExactions = plats.plat_zone && (map((plat_exaction) => {
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
                            <p className="table-data">$ {plat_exaction.dues_roads}</p>
                        </div>
                        <div className="row table-border">
                            <p className="table-data">$ {plat_exaction.dues_open_spaces}</p>
                        </div>
                        <div className="row table-border">
                            <p className="table-data">$ {plat_exaction.dues_sewer_cap}</p>
                        </div>
                        <div className="row table-border">
                            <p className="table-data">$ {plat_exaction.dues_sewer_trans}</p>
                        </div>
                        <div className="row table-border">
                            <p className="table-data">$ {plat_exaction.dues_parks}</p>
                        </div>
                        <div className="row table-border">
                            <p className="table-data">$ {plat_exaction.dues_storm_water}</p>
                        </div>
                    </div>
                </div>
            );
        })(plats.plat_zone));

        return (
            <div className="plat-existing">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>PLATS - {plats.name}</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'plat'} parent_name={'Plats'} />

                <div className="inside-body">
                    <div className="container">
                        <div className="col-md-offset-1 col-md-10 panel-group" id="accordion" role="tablist" aria-multiselectable="false">
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
                                        <h2>General Plat Information</h2>
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
                                    <div className="col-xs-12">
                                        <Link to={`plat/form/${plats.id}`} className="btn btn-mid-level edit-button">
                                            Edit
                                        </Link>
                                    </div>
                                    <div className="col-xs-12">
                                        <p className="col-md-3 col-sm-4 col-xs-6">Plat Name: {plats.name}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6">Plat Type: {plats.plat_type}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6">Approval: {plats.is_approved ? 'Approved' : 'Not Approved'}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6">Expansion Area: {plats.expansion_area}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6">Unit: {plats.unit}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6">Section: {plats.section}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6">Block: {plats.block}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6">Cabinet: {plats.cabinet}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6">Slide: {plats.slide}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6">Buildable Lots: {plats.buildable_lots}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6">Non-Buildable Lots: {plats.non_buildable_lots}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6">Sewer Exactions: ${plats.sewer_due}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6">Non-Sewer Exactions: ${plats.non_sewer_due}</p>
                                        <p className="col-xs-12">Calculation Note: {plats.calculation_note}</p>
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
                                        <div className="col-sm-10">
                                            <h2>Plat Zones</h2>
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
                                        <div className="col-xs-12">
                                            <div className="col-xs-12">
                                                <Link to={`plat/form/${plats.id}`} className="btn btn-mid-level edit-button">
                                                    Edit
                                                </Link>
                                            </div>
                                            <div className="col-xs-12">
                                                { platZonesList }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>}

                            { plats && plats.plat_zone &&
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
                                                <h2>Plat Exactions</h2>
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
                                            <div className="col-xs-12">
                                                <div className="col-xs-12">
                                                    <Link to={`plat/form/${plats.id}`} className="btn btn-mid-level edit-button">
                                                        Edit
                                                    </Link>
                                                </div>
                                                <div className="col-xs-12">
                                                    <div className="col-xs-3">
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
                                                            <p>Sewer Transmmission</p>
                                                        </div>
                                                        <div className="col-xs-12 table-border">
                                                            <p>Parks</p>
                                                        </div>
                                                        <div className="col-xs-12 table-border">
                                                            <p>Storm Water</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-xs-9">
                                                        {platZoneExactions}
                                                    </div>
                                                </div>
                                                <div className="col-xs-12">
                                                    <div className="row">
                                                        <h3>Plat Exactions</h3>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-sm-offset-2 col-sm-5">
                                                            <p>Sewer Dues: {plats.sewer_due}</p>
                                                        </div>
                                                        <div className="col-sm-5">
                                                            <p>Non-Sewer Dues: {plats.non_sewer_due}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }

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
                                    <div className="col-xs-10">
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
                                        {plats.id &&
                                            <Notes content_type="Plat" object_id={plats.id} />
                                        }
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
        plats: state.plats,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedPlat = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(getPlatID(selectedPlat));
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(PlatExisting);
