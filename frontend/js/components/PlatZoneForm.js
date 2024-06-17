import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import FormGroup from './FormGroup';
import DeclineDelete from './DeclineDelete';

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
            formChange,
            onPlatZoneSubmit,
            currentUser,
            calculationWarning,
        } = this.props;

        const submitEnabled =
            activeForm.zone &&
            activeForm.acres;

        return (
            <div className="plat-zone-form">
                <form >
                    <fieldset>
                        <div className="row form-subheading">
                            {this.props.zone_value ? <h3>Plat Zone - {this.props.zone_value}</h3> : <h3>Plat Zone</h3>}
                        </div>
                        <div className="row">
                            <div className="col-sm-6 form-group">
                                <label htmlFor="plat" className="form-label" id="plat">* Plat</label>
                                <select
                                    className="form-control"
                                    id="plat"
                                    onChange={formChange('plat')}
                                    value={activeForm.plat_name}
                                    disabled
                                >
                                    <option value="start_plat">{activeForm.plat_name}</option>
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6 form-group">
                                <label htmlFor={this.props.zone_id} className="form-label">* Zone</label>
                                <select
                                    className="form-control"
                                    id={this.props.zone_id}
                                    onChange={formChange('zone')}
                                    onFocus={() => this.props.zone_value ? calculationWarning(`${this.props.zone_id}_warning`) : null}
                                >
                                    {this.props.zone_value ? (
                                        <option value={[`${this.props.zone_value}`, `${this.props.zone_value}`]} aria-label={this.props.zone_value}>{this.props.zone_value}</option>
                                    ) : (
                                        <option value="start_zone" aria-label="Zone">Zone</option>
                                    )}
                                    <option value={['EAR-1', 'EAR-1']}>EAR-1</option>
                                    <option value={['EAR-1SRA', 'EAR-1SRA']}>EAR-1SRA</option>
                                    <option value={['EAR-2', 'EAR-2']}>EAR-2</option>
                                    <option value={['EAR-3', 'EAR-3']}>EAR-3</option>
                                    <option value={['CC(RES)', 'CC(RES)']}>CC(RES)</option>
                                    <option value={['CC(NONR)', 'CC(NONR)']}>CC(NONR)</option>
                                    <option value={['ED', 'ED']}>ED</option>
                                </select>
                            </div>
                            <div className="col-sm-6">
                                <FormGroup label="* Gross Acreage" id={this.props.acre_id}>
                                    <input type="number" step="0.01" className="form-control" placeholder="Gross Acreage" onFocus={() => this.props.zone_value ? calculationWarning(`${this.props.zone_id}_warning`) : null} />
                                </FormGroup>
                            </div>
                        </div>
                        <div className="row alert alert-danger hidden" id={`${this.props.zone_id}_warning`}>
                            <div className="col-xs-8 col-xs-offset-2 text-center">
                                Calculations for this plat were made based on the original zone.<br />Any changes made to the zone now will <strong>NOT</strong> result in new calculations being made.<br />Changes can be made manually in the form below.
                            </div>
                        </div>
                    </fieldset>
                    <div>
                        <div className="col-xs-8">
                            <button className="btn btn-lex" onClick={onPlatZoneSubmit({ activeForm })} >
                                {currentUser.is_superuser || (currentUser.profile && currentUser.profile.is_supervisor) ? <div>Submit / Approve</div> : <div>Submit</div>}
                            </button>
                            {!submitEnabled ? (
                                <div>
                                    <div className="clearfix" />
                                    <span> * All required fields must be filled.</span>
                                </div>
                            ) : null
                            }
                        </div>
                        <div className="col-xs-4">
                            <DeclineDelete currentForm="/platZone/" selectedEntry={this.props.plat_zone_value} parentRoute="plat" />
                        </div>
                    </div>
                    <div className="clearfix" />
                </form>
            </div>
        );
    }
}

PlatZoneForm.propTypes = {
    activeForm: PropTypes.object,
    plat_zone_id: PropTypes.string,
    plat_zone_value: PropTypes.number,
    acre_id: PropTypes.string,
    acre_value: PropTypes.string,
    zone_id: PropTypes.string,
    zone_value: PropTypes.string,
    onComponentDidMount: PropTypes.func,
    formChange: PropTypes.func,
    onPlatZoneSubmit: PropTypes.func,
    currentUser: PropTypes.object,
    calculationWarning: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        activeForm: state.activeForm,
        currentUser: state.currentUser,
    };
}

function mapDispatchToProps(dispatch, props) {
    const selectedPlatZone = props.plat_zone_value;
    const selectedPlatZoneId = props.zone_id;

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
                const field_show = `${[field]}_show`;

                const update = {
                    [field]: value_id,
                    [field_name]: value_name,
                    [field_show]: value,
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
                    // setting zone based on the submitted select to avoid mishaps on clicking a different submit button than the one changed.
                    let zone = document.getElementById(`${selectedPlatZoneId}`);
                    zone = zone.options[zone.selectedIndex].value;
                    zone = zone.substr(0, zone.indexOf(','));

                    const acres = activeForm.activeForm[`${props.acre_id}`];
                    dispatch(putPlatZone(selectedPlatZone, zone, acres));
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
        calculationWarning(warning_id) {
            document.getElementById(warning_id).classList.remove('hidden');
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlatZoneForm);

