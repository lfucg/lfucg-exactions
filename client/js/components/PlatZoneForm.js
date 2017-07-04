import React from 'react';
import { connect } from 'react-redux';
import {
    Link,
    hashHistory,
} from 'react-router';
import { map } from 'ramda';

import FormGroup from './FormGroup';

import {
    formInit,
    formUpdate,
} from '../actions/formActions';

import {
    getPlatID,
    postPlat,
    putPlat,
    getPlatZones,
    getPlatZoneID,
    postPlatZone,
    putPlatZone,
} from '../actions/apiActions';

class PlatZoneForm extends React.Component {
    static propTypes = {
        activeForm: React.PropTypes.object,
        plats: React.PropTypes.object,
        formChange: React.PropTypes.func,
        onPlatZoneSubmit: React.PropTypes.func,
    };

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
                <form onSubmit={onPlatZoneSubmit} >
                    <fieldset>
                        <div className="row form-subheading">
                            <h3>Plat Zone</h3>
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
                                <label htmlFor="zone" className="form-label" id="zone">* Zone</label>
                                <select className="form-control" onChange={formChange('zone')} >
                                    {activeForm.zone_name ? (
                                        <option value="zone_name" aria-label={activeForm.zone_name}>{activeForm.zone_name}</option>
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
                                <FormGroup label="* Acres" id="acres">
                                    <input type="number" className="form-control" placeholder="Acres" />
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

function mapStateToProps(state) {
    return {
        activeForm: state.activeForm,
        plats: state.plats,
    };
}

function mapDispatchToProps(dispatch) {
    return {
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
        onPlatZoneSubmit(event) {
            event.preventDefault();
            dispatch(postPlatZone());
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlatZoneForm);

