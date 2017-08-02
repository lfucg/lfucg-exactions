import React from 'react';
import { connect } from 'react-redux';
import {
    hashHistory,
} from 'react-router';
import { map } from 'ramda';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Notes from './Notes';

import FormGroup from './FormGroup';
import PlatZoneForm from './PlatZoneForm';
import PlatZoneDuesForm from './PlatZoneDuesForm';

import {
    formInit,
    formUpdate,
} from '../actions/formActions';

import {
    getMe,
    getSubdivisions,
    getSubdivisionID,
    getPlatID,
    postPlat,
    putPlat,
} from '../actions/apiActions';

class PlatForm extends React.Component {
    static propTypes = {
        activeForm: React.PropTypes.object,
        subdivisions: React.PropTypes.object,
        plats: React.PropTypes.object,
        route: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
        formChange: React.PropTypes.func,
        onPlatSubmit: React.PropTypes.func,
        onPlatAndCreateLot: React.PropTypes.func,
        addAnotherPlatZone: React.PropTypes.func,
        onPlatDues: React.PropTypes.func,
    };

    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            activeForm,
            subdivisions,
            plats,
            formChange,
            onPlatSubmit,
            onPlatAndCreateLot,
            addAnotherPlatZone,
            onPlatDues,
        } = this.props;

        const subdivisionsList = subdivisions.length > 0 ? (map((single_subdivision) => {
            return (
                <option key={single_subdivision.id} value={[single_subdivision.id, single_subdivision.name]} >
                    {single_subdivision.name}
                </option>
            );
        })(subdivisions)) : null;

        const platZonesList = plats.plat_zone ? (map((single_plat_zone) => {
            return (
                <div key={single_plat_zone.id} >
                    <PlatZoneForm
                      props={this.props}
                      acre_id={`${single_plat_zone.id}_acres`}
                      acre_value={single_plat_zone.cleaned_acres}
                      zone_id={`${single_plat_zone.id}_zone`}
                      zone_value={single_plat_zone.zone}
                      plat_zone_id={`${single_plat_zone.id}_plat_zone`}
                      plat_zone_value={single_plat_zone.id}
                    />
                </div>
            );
        })(plats.plat_zone)) : null;

        const platZoneDuesList = plats.plat_zone ? (map((single_plat_zone) => {
            return (
                <div key={single_plat_zone.id} >
                    <div className={plats.plat_zone.length < 1 ? 'col-xs-6' : 'col-xs-4'}>
                        <PlatZoneDuesForm
                          props={this.props}
                          plat_zone_id={`${single_plat_zone.id}_plat_zone`}
                          plat_zone_value={single_plat_zone.id}
                          zone_id={`${single_plat_zone.id}_zone`}
                          zone_value={single_plat_zone.zone}
                          acre_id={`${single_plat_zone.id}_acres`}
                          acre_value={single_plat_zone.cleaned_acres}
                          dues_roads_id={`${single_plat_zone.id}_dues_roads`}
                          dues_roads_value={single_plat_zone.dues_roads}
                          dues_open_spaces_id={`${single_plat_zone.id}_dues_open_spaces`}
                          dues_open_spaces_value={single_plat_zone.dues_open_spaces}
                          dues_sewer_cap_id={`${single_plat_zone.id}_dues_sewer_cap`}
                          dues_sewer_cap_value={single_plat_zone.dues_sewer_cap}
                          dues_sewer_trans_id={`${single_plat_zone.id}_dues_sewer_trans`}
                          dues_sewer_trans_value={single_plat_zone.dues_sewer_trans}
                          dues_parks_id={`${single_plat_zone.id}_dues_parks`}
                          dues_parks_value={single_plat_zone.dues_parks}
                          dues_storm_water_id={`${single_plat_zone.id}_dues_storm_water`}
                          dues_storm_water_value={single_plat_zone.dues_storm_water}
                        />
                    </div>
                </div>
            );
        })(plats.plat_zone)) : null;

        const submitEnabled =
            activeForm.total_acreage &&
            activeForm.plat_type &&
            activeForm.expansion_area &&
            activeForm.section &&
            activeForm.block &&
            activeForm.buildable_lots &&
            activeForm.non_buildable_lots &&
            activeForm.cabinet &&
            activeForm.slide;

        return (
            <div className="plat-form">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>PLATS - CREATE / APPLY</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'plat/existing'} parent_name={'Plats'} />

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
                              className={activeForm.first_section ? 'panel-collapse collapse row' : 'panel-collapse row'}
                              role="tabpanel"
                              aria-labelledby="#headingPlat"
                            >
                                <div className="panel-body">
                                    <form onSubmit={onPlatSubmit} className="col-xs-12">

                                        <fieldset>
                                            <div className="row form-subheading">
                                                <h3>Location</h3>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6 form-group">
                                                    <label htmlFor="subdivision" className="form-label" id="subdivision">Subdivision</label>
                                                    <select className="form-control" id="subdivision" onChange={formChange('subdivision')} >
                                                        {activeForm.subdivision ? (
                                                            <option value="choose_subdivision" aria-label="Select a Subdivision">
                                                                {activeForm.subdivision_name}
                                                            </option>
                                                        ) : (
                                                            <option value="choose_subdivision" aria-label="Select a Subdivision">
                                                                Select a Subdivision
                                                            </option>
                                                        )}
                                                        {subdivisionsList}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <FormGroup label="Latitude" id="latitude">
                                                        <input type="text" className="form-control" placeholder="Latitude" />
                                                    </FormGroup>
                                                </div>
                                                <div className="col-sm-6">
                                                    <FormGroup label="Longitude" id="longitude">
                                                        <input type="text" className="form-control" placeholder="Longitude" />
                                                    </FormGroup>
                                                </div>
                                            </div>
                                            <div className="row form-subheading">
                                                <h3>Land Attributes</h3>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6 form-group">
                                                    <label htmlFor="expansion_area" className="form-label" id="expansion_area">* Expansion Area</label>
                                                    <select className="form-control" id="expansion_area" onChange={formChange('expansion_area')} >
                                                        {plats.expansion_area ? (
                                                            <option value="expansion_area" aria-label={`Expansion Area ${plats.expansion_area}`}>{plats.expansion_area}</option>
                                                        ) : (
                                                            <option value="choose_expansion_area" aria-label="Choose an Expansion Area">Choose an Expansion Area</option>
                                                        )}
                                                        <option value={['EA-1', 'EA-1']}>EA-1</option>
                                                        <option value={['EA-2A', 'EA-2A']}>EA-2A</option>
                                                        <option value={['EA-2B', 'EA-2B']}>EA-2B</option>
                                                        <option value={['EA-2C', 'EA-2C']}>EA-2C</option>
                                                        <option value={['EA-3', 'EA-3']}>EA-3</option>
                                                    </select>
                                                </div>
                                                <div className="col-sm-6">
                                                    <FormGroup label="* Gross Acreage" id="total_acreage">
                                                        <input type="number" className="form-control" placeholder="Gross Acreage" />
                                                    </FormGroup>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <FormGroup label="* Buildable Lots" id="buildable_lots">
                                                        <input type="number" className="form-control" placeholder="Buildable Lots" />
                                                    </FormGroup>
                                                </div>
                                                <div className="col-sm-6">
                                                    <FormGroup label="* Non-Buildable Lots" id="non_buildable_lots">
                                                        <input type="number" className="form-control" placeholder="Non-Buildable Lots" />
                                                    </FormGroup>
                                                </div>
                                            </div>
                                            <div className="row form-subheading">
                                                <h3>Additional Plat Details</h3>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <FormGroup label="* Name" id="name">
                                                        <input type="text" className="form-control" placeholder="Name" />
                                                    </FormGroup>
                                                </div>
                                                <div className="col-sm-6">
                                                    <FormGroup label="* Date Recorded" id="date_recorded">
                                                        <input type="date" className="form-control" placeholder="Date Recorded" />
                                                    </FormGroup>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6 form-group">
                                                    <label htmlFor="plat_type" className="form-label" id="plat_type">* Plat Type</label>
                                                    <select className="form-control" id="plat_type" onChange={formChange('plat_type')} >
                                                        {plats.plat_type ? (
                                                            <option value="plat_type" aria-label={`Plat Type ${plats.plat_type}`}>{plats.plat_type}</option>
                                                        ) : (
                                                            <option value="choose_plat_type" aria-label="Choose a Plat Type">Choose an Plat Type</option>
                                                        )}
                                                        <option value={['PLAT', 'Final Record Plat']}>Final Record Plat</option>
                                                        <option value={['DEVELOPMENT_PLAN', 'Final Development Plan']}>Final Development Plan</option>
                                                    </select>
                                                </div>
                                                <div className="col-sm-6">
                                                    <FormGroup label="* Section" id="section">
                                                        <input type="text" className="form-control" placeholder="Section" />
                                                    </FormGroup>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <FormGroup label="Unit" id="unit">
                                                        <input type="text" className="form-control" placeholder="Unit" />
                                                    </FormGroup>
                                                </div>
                                                <div className="col-sm-6">
                                                    <FormGroup label="* Block" id="block">
                                                        <input type="text" className="form-control" placeholder="Block" />
                                                    </FormGroup>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <FormGroup label="* Cabinet" id="cabinet">
                                                        <input type="text" className="form-control" placeholder="Cabinet" />
                                                    </FormGroup>
                                                </div>
                                                <div className="col-sm-6">
                                                    <FormGroup label="* Slide" id="slide">
                                                        <input type="text" className="form-control" placeholder="Slide" />
                                                    </FormGroup>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <button disabled={!submitEnabled} className="btn btn-lex">Submit</button>
                                        {!submitEnabled ? (
                                            <div>
                                                <div className="clearfix" />
                                                <span> * All required fields must be filled.</span>
                                            </div>
                                        ) : null
                                        }
                                    </form>
                                </div>
                            </div>
                            { activeForm.first_section ? (
                                <div>
                                    { activeForm.zone_section ? (
                                        <div>
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
                                                        { platZonesList }
                                                    </div>
                                                    { plats.plat_zone && plats.plat_zone.length > 0 ?
                                                        <div className="col-xs-12">
                                                            <button className="btn btn-lex" onClick={addAnotherPlatZone} >Add Another Plat Zone</button>
                                                        </div>
                                                    : null}
                                                    { activeForm.add_another_plat_zone &&
                                                        <div className="col-xs-12">
                                                            <PlatZoneForm
                                                              props={this.props}
                                                              acre_id="acres"
                                                              zone_id="zone"
                                                            />
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            <a
                                              role="button"
                                              data-toggle="collapse"
                                              data-parent="#accordion"
                                              href="#collapsePlatExactions"
                                              aria-expanded="true"
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
                                              className="panel-collapse collapse in row"
                                              role="tabpanel"
                                              aria-labelledby="#headingPlatExactions"
                                            >
                                                <div className="panel-body">
                                                    <div className="col-xs-12">
                                                        <form onSubmit={onPlatDues}>
                                                            <fieldset>
                                                                <div className="row form-subheading">
                                                                    <h3>Exactions and Calculations</h3>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-xs-3">
                                                                        <div className="col-xs-12 dues-table-heading">
                                                                            <h3>Zone</h3>
                                                                        </div>
                                                                        <div className="col-xs-12 dues-label">
                                                                            <h4>Gross Acreage</h4>
                                                                        </div>
                                                                        <div className="col-xs-12 dues-label">
                                                                            <h4>Roads</h4>
                                                                        </div>
                                                                        <div className="col-xs-12 dues-label">
                                                                            <h4>Open Space</h4>
                                                                        </div>
                                                                        <div className="col-xs-12 dues-label">
                                                                            <h4>Sewer Capacity</h4>
                                                                        </div>
                                                                        <div className="col-xs-12 dues-label">
                                                                            <h4>Sewer Transmmission</h4>
                                                                        </div>
                                                                        <div className="col-xs-12 dues-label">
                                                                            <h4>Parks</h4>
                                                                        </div>
                                                                        <div className="col-xs-12 dues-label">
                                                                            <h4>Storm Water</h4>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-xs-9">
                                                                        {platZoneDuesList}
                                                                    </div>
                                                                </div>
                                                                <div className="col-xs-12 dues-table-heading"><h3>Plat Exactions</h3></div>
                                                                <div className="row">
                                                                    <div className="col-sm-6">
                                                                        <FormGroup label="Sewer Exactions" id="sewer_due">
                                                                            <input type="number" className="form-control" placeholder="Sewer Exactions" disabled />
                                                                        </FormGroup>
                                                                    </div>
                                                                    <div className="col-sm-6">
                                                                        <FormGroup label="Non-Sewer Exactions" id="non_sewer_due">
                                                                            <input type="number" className="form-control" placeholder="Non-Sewer Exactions" disabled />
                                                                        </FormGroup>
                                                                    </div>
                                                                </div>
                                                                {
                                                                // <div className="row">
                                                                //     <div className="col-xs-12">
                                                                //         <FormGroup label="* Calculation Notes" id="calculation_note">
                                                                //             <textarea type="text" className="form-control" placeholder="Calculation Notes" rows="4" />
                                                                //         </FormGroup>
                                                                //     </div>
                                                                // </div>
                                                                }
                                                            </fieldset>
                                                            <div className="col-xs-offset-2 col-xs-4">
                                                                <button className="btn btn-lex" >Submit Exactions</button>
                                                            </div>
                                                            <div className="col-xs-offset-1 col-xs-4">
                                                                <button className="btn btn-lex" onClick={onPlatAndCreateLot} >Submit and Create Lot</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="row section-heading">
                                                <h2>Plat Zone</h2>
                                            </div>
                                            <PlatZoneForm
                                              props={this.props}
                                              acre_id="acres"
                                              zone_id="zone"
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : null }
                            <a
                              role="button"
                              data-toggle="collapse"
                              data-parent="#accordion"
                              href="#collapseNotes"
                              aria-expanded="true"
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
                              className="panel-collapse collapse in row"
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
        activeForm: state.activeForm,
        subdivisions: state.subdivisions,
        plats: state.plats,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedPlat = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(formInit());
            const else_update = {
                first_section: false,
                add_another_plat_zone: false,
            };
            dispatch(formUpdate(else_update));
            dispatch(getSubdivisions());
            dispatch(getMe())
            .then((data_me) => {
                if (data_me.error) {
                    hashHistory.push('login/');
                }
                if (selectedPlat) {
                    dispatch(getPlatID(selectedPlat))
                    .then((data_plat) => {
                        if (data_plat.response.subdivision) {
                            dispatch(getSubdivisionID(data_plat.response.subdivision))
                            .then((data_sub_id) => {
                                const update2 = {
                                    subdivision_name: data_sub_id.response.name,
                                };
                                dispatch(formUpdate(update2));
                            });
                        }
                        if (data_plat.response.plat_zone && data_plat.response.plat_zone.length === 0) {
                            const zone_update = {
                                acres: data_plat.response.cleaned_total_acreage,
                            };
                            dispatch(formUpdate(zone_update));
                        }
                        if (data_plat.response.plat_zone && data_plat.response.plat_zone.length > 0) {
                            const zones_exist_update = {
                                zone_section: true,
                            };
                            dispatch(formUpdate(zones_exist_update));
                        }
                        const update = {
                            subdivision: data_plat.response.subdivision,
                            date_recorded: data_plat.response.date_recorded,
                            latitude: data_plat.response.latitude,
                            longitude: data_plat.response.longitude,
                            expansion_area: data_plat.response.expansion_area,
                            total_acreage: data_plat.response.cleaned_total_acreage,
                            buildable_lots: data_plat.response.buildable_lots,
                            non_buildable_lots: data_plat.response.non_buildable_lots,
                            sewer_due: data_plat.response.sewer_due,
                            non_sewer_due: data_plat.response.non_sewer_due,
                            calculation_note: data_plat.response.calculation_note,
                            name: data_plat.response.name,
                            plat_type: data_plat.response.plat_type,
                            section: data_plat.response.section,
                            unit: data_plat.response.unit,
                            block: data_plat.response.block,
                            cabinet: data_plat.response.cabinet,
                            slide: data_plat.response.slide,
                            plat: data_plat.response.id,
                            plat_name: data_plat.response.name,
                            first_section: true,
                            add_another_plat_zone: false,
                        };
                        dispatch(formUpdate(update));
                    });
                }
            });
        },
        formChange(field) {
            return (e, ...args) => {
                const value = typeof e.target.value !== 'undefined' ? e.target.value : args[1];

                const comma_index = value.indexOf(',');
                const value_id = value.substring(0, comma_index);
                const value_name = value.substring(comma_index + 1, value.length);
                const field_name = `${[field]}_name`;

                const update = {
                    [field]: value_id,
                    [field_name]: value_name,
                };
                dispatch(formUpdate(update));
            };
        },
        onPlatSubmit(event) {
            event.preventDefault();
            if (selectedPlat) {
                dispatch(putPlat(selectedPlat))
                .then(() => {
                    const put_update = {
                        first_section: true,
                    };
                    dispatch(formUpdate(put_update));
                });
            } else {
                dispatch(postPlat())
                .then((data_post) => {
                    const zone_update = {
                        plat: data_post.response.id,
                        plat_name: data_post.response.name,
                        acres: data_post.response.total_acreage,
                        first_section: true,
                    };
                    dispatch(formUpdate(zone_update));
                    hashHistory.push(`plat/form/${data_post.response.id}`);
                });
            }
        },
        addAnotherPlatZone(event) {
            event.preventDefault();
            const update = {
                add_another_plat_zone: true,
            };
            dispatch(formUpdate(update));
        },
        onPlatDues() {
            if (selectedPlat) {
                dispatch(putPlat(selectedPlat));
            }
        },
        onPlatAndCreateLot() {
            if (selectedPlat) {
                dispatch(putPlat(selectedPlat))
                .then(() => {
                    hashHistory.push(`plat/${selectedPlat}/lot/form`);
                });
            }
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlatForm);

