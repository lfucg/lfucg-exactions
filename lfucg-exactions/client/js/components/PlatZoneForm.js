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
    postPlatZone,
    putPlatZone,
    getPlatID,
} from '../actions/apiActions';

class PlatZoneForm extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount({
            plat_zone_id: this.props.plat_zone_id,
            plat_zone_value: this.props.plat_zone_value,
            acre_id: this.props.acre_id,
            acre_value: this.props.acre_value,
            zone_id: this.props.zone_id,
            zone_value: this.props.zone_value,
        });
    }

    render() {
        const {
            activeForm,
            plats,
            formChange,
            onPlatZoneSubmit,
        } = this.props;

        const submitEnabled =
            activeForm.zone &&
            activeForm.acres;

        return (
            <div className="plat-zone-form">
                <form onSubmit={onPlatZoneSubmit({ activeForm })} >
                    <fieldset>
                        <div className="row form-subheading">
                            {this.props.zone_value ? <h3>Plat Zone - {this.props.zone_value}</h3> : <h3>Plat Zone</h3>}
                        </div>
                        <div className="row">
                            <div className="col-sm-6 form-group">
                                <label htmlFor="plat" className="form-label" id="plat">* Plat</label>
                                <select className="form-control" id="plat" onChange={formChange('plat')} >
                                    {activeForm.plat ? (
                                        <option value="choose_plat" aria-label={activeForm.plat_name}>
                                            {activeForm.plat_name}
                                        </option>
                                    ) : (
                                        <option value="choose_plat" aria-label="Select a Plat">
                                            Visit appropriate plat entry form for other plats.
                                        </option>
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6 form-group">
                                <label htmlFor={this.props.zone_id} className="form-label" id={this.props.zone_id}>* Zone</label>
                                <select className="form-control" id={this.props.zone_id} onChange={formChange('zone')} >
                                    {this.props.zone_value ? (
                                        <option value="zone_name" aria-label={this.props.zone_value}>{this.props.zone_value}</option>
                                    ) : (
                                        <option value="start_zone" aria-label="Zone">Zone</option>
                                    )}
                                    <option value={['EAR-1', 'EAR-1']}>EAR-1</option>
                                    <option value={['EAR1-SRA', 'EAR1-SRA']}>EAR1-SRA</option>
                                    <option value={['EAR-2', 'EAR-2']}>EAR-2</option>
                                    <option value={['EAR-3', 'EAR-3']}>EAR-3</option>
                                    <option value={['CC(RES)', 'CC(RES)']}>CC(RES)</option>
                                    <option value={['CC(NONR)', 'CC(NONR)']}>CC(NONR)</option>
                                    <option value={['ED', 'ED']}>ED</option>
                                </select>
                            </div>
                            <div className="col-sm-6">
                                <FormGroup label="* Gross Acreage" id={this.props.acre_id}>
                                    <input type="number" className="form-control" placeholder="Gross Acreage" />
                                </FormGroup>
                            </div>
                        </div>
                    </fieldset>
                    <button className="btn btn-lex">Submit Plat Zone</button>
                    {!submitEnabled ? (
                        <div>
                            <div className="clearfix" />
                            <span> * All required fields must be filled.</span>
                        </div>
                    ) : null
                    }
                </form>
            </div>
        );
    }
}

PlatZoneForm.propTypes = {
    activeForm: PropTypes.object,
    plats: PropTypes.object,
    plat_zone_id: PropTypes.string,
    plat_zone_value: PropTypes.number,
    acre_id: PropTypes.string,
    acre_value: PropTypes.number,
    zone_id: PropTypes.string,
    zone_value: PropTypes.string,
    onComponentDidMount: PropTypes.func,
    formChange: PropTypes.func,
    onPlatZoneSubmit: PropTypes.func,
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
                const plat_zone_update = {};

                plat_zone_update[pass_props.plat_zone_id] = pass_props.plat_zone_value;
                plat_zone_update[pass_props.acre_id] = pass_props.acre_value;
                plat_zone_update[pass_props.zone_id] = pass_props.zone_value;

                dispatch(formUpdate(plat_zone_update));
            }
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
        onPlatZoneSubmit(activeForm) {
            return () => {
                const plat_zone_update = {
                    zone_section: true,
                };
                dispatch(formUpdate(plat_zone_update));
                if (selectedPlatZone) {
                    const zone = activeForm.activeForm[`${props.zone_id}`];
                    const acres = activeForm.activeForm[`${props.acre_id}`];
                    dispatch(putPlatZone(selectedPlatZone, zone, acres))
                    .then(() => {
                        dispatch(getPlatID(activeForm.activeForm.plat))
                        .then((zone_put_get_plat) => {
                            const zone_put_update = {
                                sewer_due: zone_put_get_plat.response.sewer_due,
                                non_sewer_due: zone_put_get_plat.response.non_sewer_due,
                                calculation_note: zone_put_get_plat.response.calculation_note,
                                add_another_plat_zone: false,
                            };
                            dispatch(formUpdate(zone_put_update));
                        });
                    });
                } else {
                    dispatch(postPlatZone())
                    .then(() => {
                        dispatch(getPlatID(activeForm.activeForm.plat))
                        .then((zone_post_get_plat) => {
                            const zone_post_update = {
                                sewer_due: zone_post_get_plat.response.sewer_due,
                                non_sewer_due: zone_post_get_plat.response.non_sewer_due,
                                calculation_note: zone_post_get_plat.response.calculation_note,
                                add_another_plat_zone: false,
                            };
                            dispatch(formUpdate(zone_post_update));
                        });
                    });
                }
            };
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlatZoneForm);

