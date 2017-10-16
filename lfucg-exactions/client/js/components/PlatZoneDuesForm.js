import React from 'react';
import { connect } from 'react-redux';
import {
    hashHistory,
} from 'react-router';
import PropTypes from 'prop-types';

import FormGroup from './FormGroup';

import {
    formUpdate,
} from '../actions/formActions';

import {
    getPlatID,
    postPlatZone,
    putPlatZoneDues,
} from '../actions/apiActions';

class PlatZoneDuesForm extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount({
            plat_zone_id: this.props.plat_zone_id,
            plat_zone_value: this.props.plat_zone_value,
            zone_id: this.props.zone_id,
            zone_value: this.props.zone_value,
            acre_id: this.props.acre_id,
            acre_value: this.props.acre_value,
            dues_roads_id: this.props.dues_roads_id,
            dues_roads_value: this.props.dues_roads_value,
            dues_open_spaces_id: this.props.dues_open_spaces_id,
            dues_open_spaces_value: this.props.dues_open_spaces_value,
            dues_sewer_cap_id: this.props.dues_sewer_cap_id,
            dues_sewer_cap_value: this.props.dues_sewer_cap_value,
            dues_sewer_trans_id: this.props.dues_sewer_trans_id,
            dues_sewer_trans_value: this.props.dues_sewer_trans_value,
            dues_parks_id: this.props.dues_parks_id,
            dues_parks_value: this.props.dues_parks_value,
            dues_storm_water_id: this.props.dues_storm_water_id,
            dues_storm_water_value: this.props.dues_storm_water_value,
        });
    }

    render() {
        const {
            activeForm,
            plats,
            onPlatZoneDuesChange,
        } = this.props;

        return (
            <div className="plat-zone-form">
                <form onBlur={onPlatZoneDuesChange({ activeForm })} >
                    <fieldset>
                        <div className="row dues-table-heading">
                            <h3>{this.props.zone_value}</h3>
                        </div>
                        <div className="row dues-acres">
                            <h4>{this.props.acre_value}</h4>
                        </div>
                        <div className="row reduced-form-label">
                            <FormGroup label="" aria-label={`${this.props.zone_value} road exaction`} id={this.props.dues_roads_id} >
                                <input type="number" className="form-control" placeholder="Road Exactions" />
                            </FormGroup>
                        </div>
                        <div className="row reduced-form-label">
                            <FormGroup label="" aria-label={`${this.props.zone_value} open space exaction`} id={this.props.dues_open_spaces_id} >
                                <input type="number" className="form-control" placeholder="Open Spaces Exactions" />
                            </FormGroup>
                        </div>
                        <div className="row reduced-form-label">
                            <FormGroup label="" aria-label={`${this.props.zone_value} sewer capacity exaction`} id={this.props.dues_sewer_cap_id} >
                                <input type="number" className="form-control" placeholder="Sewer Capacity Exactions" />
                            </FormGroup>
                        </div>
                        <div className="row reduced-form-label">
                            <FormGroup label="" aria-label={`${this.props.zone_value} sewer transmission exaction`} id={this.props.dues_sewer_trans_id} >
                                <input type="number" className="form-control" placeholder="Sewer Transmission Exactions" />
                            </FormGroup>
                        </div>
                        <div className="row reduced-form-label">
                            <FormGroup label="" aria-label={`${this.props.zone_value} parks exaction`} id={this.props.dues_parks_id} >
                                <input type="number" className="form-control" placeholder="Park Exactions" />
                            </FormGroup>
                        </div>
                        <div className="row reduced-form-label">
                            <FormGroup label="" aria-label={`${this.props.zone_value} storm water exaction`} id={this.props.dues_storm_water_id} >
                                <input type="number" className="form-control" placeholder="Storm Water Exactions" />
                            </FormGroup>
                        </div>
                    </fieldset>
                </form>
            </div>
        );
    }
}

PlatZoneDuesForm.propTypes = {
    activeForm: PropTypes.object,
    plats: PropTypes.array,
    plat_zone_id: PropTypes.string,
    plat_zone_value: PropTypes.number,
    zone_id: PropTypes.string,
    zone_value: PropTypes.string,
    acre_id: PropTypes.string,
    acre_value: PropTypes.number,
    dues_roads_id: PropTypes.string,
    dues_roads_value: PropTypes.number,
    dues_open_spaces_id: PropTypes.string,
    dues_open_spaces_value: PropTypes.number,
    dues_sewer_cap_id: PropTypes.string,
    dues_sewer_cap_value: PropTypes.number,
    dues_sewer_trans_id: PropTypes.string,
    dues_sewer_trans_value: PropTypes.number,
    dues_parks_id: PropTypes.string,
    dues_parks_value: PropTypes.number,
    dues_storm_water_id: PropTypes.string,
    dues_storm_water_value: PropTypes.number,
    onComponentDidMount: PropTypes.func,
    onPlatZoneDuesChange: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        activeForm: state.activeForm,
        plats: state.plats,
    };
}

function mapDispatchToProps(dispatch, props) {
    const selectedPlatZone = props.plat_zone_value;

    return {
        onComponentDidMount(pass_props) {
            if (pass_props.plat_zone_value) {
                const plat_zone_dues_update = {};

                plat_zone_dues_update[pass_props.zone_value] = pass_props.zone_value;
                plat_zone_dues_update[pass_props.acre_value] = pass_props.acre_value;
                plat_zone_dues_update[pass_props.plat_zone_id] = pass_props.plat_zone_value;
                plat_zone_dues_update[pass_props.dues_roads_id] = pass_props.dues_roads_value;
                plat_zone_dues_update[pass_props.dues_open_spaces_id] = pass_props.dues_open_spaces_value;
                plat_zone_dues_update[pass_props.dues_sewer_cap_id] = pass_props.dues_sewer_cap_value;
                plat_zone_dues_update[pass_props.dues_sewer_trans_id] = pass_props.dues_sewer_trans_value;
                plat_zone_dues_update[pass_props.dues_parks_id] = pass_props.dues_parks_value;
                plat_zone_dues_update[pass_props.dues_storm_water_id] = pass_props.dues_storm_water_value;

                dispatch(formUpdate(plat_zone_dues_update));
            }
        },
        onPlatZoneDuesChange(activeForm) {
            return (e, ...args) => {
                const field_name = typeof e.target.id !== 'undefined' ? e.target.id : args[1];
                const value = typeof e.target.value !== 'undefined' ? e.target.value : args[1];
                const update = {
                    [field_name]: value,
                };
                dispatch(formUpdate(update));
                if (selectedPlatZone) {
                    const zone = activeForm.activeForm[`${props.zone_id}`];
                    const acres = activeForm.activeForm[`${props.acre_id}`];
                    const dues_roads = (field_name === props.dues_roads_id) ? value : activeForm.activeForm[`${props.dues_roads_id}`];
                    const dues_open_spaces = (field_name === props.dues_open_spaces_id) ? value : activeForm.activeForm[`${props.dues_open_spaces_id}`];
                    const dues_sewer_cap = (field_name === props.dues_sewer_cap_id) ? value : activeForm.activeForm[`${props.dues_sewer_cap_id}`];
                    const dues_sewer_trans = (field_name === props.dues_sewer_trans_id) ? value : activeForm.activeForm[`${props.dues_sewer_trans_id}`];
                    const dues_parks = (field_name === props.dues_parks_id) ? value : activeForm.activeForm[`${props.dues_parks_id}`];
                    const dues_storm_water = (field_name === props.dues_storm_water_id) ? value : activeForm.activeForm[`${props.dues_storm_water_id}`];

                    dispatch(putPlatZoneDues(
                        selectedPlatZone,
                        zone,
                        acres,
                        dues_roads,
                        dues_open_spaces,
                        dues_sewer_cap,
                        dues_sewer_trans,
                        dues_parks,
                        dues_storm_water,
                    ))
                    .then((data_plat_zone) => {
                        dispatch(getPlatID(data_plat_zone.response.plat))
                        .then((data_plat) => {
                            const update2 = {
                                sewer_due: data_plat.response.sewer_due,
                                non_sewer_due: data_plat.response.non_sewer_due,
                            };
                            dispatch(formUpdate(update2));
                        });
                    });
                } else {
                    dispatch(postPlatZone());
                }
            };
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlatZoneDuesForm);

