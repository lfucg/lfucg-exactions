import React from 'react';
import { connect } from 'react-redux';
import {
    Link,
    hashHistory,
} from 'react-router';
import { map } from 'ramda';

import Navbar from './Navbar';
import Footer from './Footer';

import FormGroup from './FormGroup';

import {
    formInit,
    formUpdate,
} from '../actions/formActions';

import {
    getSubdivisions,
    getPlatID,
    postPlat,
    putPlat,
} from '../actions/apiActions';

class PlatForm extends React.Component {
    static propTypes = {
        activeForm: React.PropTypes.object,
        subdivisions: React.PropTypes.object,
        plats: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
        formChange: React.PropTypes.func,
        onSubmit: React.PropTypes.func,
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
            onSubmit,
        } = this.props;

        const subdivisionsList = subdivisions.length > 0 ? (map((single_subdivision) => {
            return (
                <option key={single_subdivision.id} value={[single_subdivision.id, single_subdivision.name]} >
                    {single_subdivision.name}
                </option>
            );
        })(subdivisions)) : null;

        const submitEnabled =
            activeForm.total_acreage &&
            activeForm.latitude &&
            activeForm.longitude &&
            activeForm.plat_type &&
            activeForm.expansion_area &&
            activeForm.unit &&
            activeForm.section &&
            activeForm.block &&
            activeForm.buildable_lots &&
            activeForm.non_buildable_lots &&
            activeForm.cabinet &&
            activeForm.slide &&
            activeForm.sewer_due &&
            activeForm.non_sewer_due;

        return (
            <div className="plat-form">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <div className="col-sm-9">
                            <h1>PLATS - CREATE / APPLY</h1>
                        </div>
                        <div className="col-sm-3">
                            <Link to="plat" className="btn btn-lex-reverse" role="link">Return to Plats</Link>
                        </div>
                    </div>
                </div>
                <div className="inside-body">
                    <div className="container">
                        <div className="col-md-offset-1 col-md-10">
                            <form onSubmit={onSubmit} >

                                <fieldset>
                                    <div className="row form-subheading">
                                        <h3>Location</h3>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6 form-group">
                                            <label htmlFor="subdivision" className="form-label" id="subdivision">* Plat</label>
                                            <select className="form-control" id="subdivision" onChange={formChange('subdivision')} >
                                                <option value="choose_subdivision" aria-label="Select a Subdivision">
                                                    {activeForm.subdivision ? activeForm.subdivision_name : <span>Select a Subdivision</span>}
                                                </option>
                                                {subdivisionsList}
                                            </select>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="* Date Recorded" id="date_recorded">
                                                <input type="date" className="form-control" placeholder="Date Recorded" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="* Latitude" id="latitude">
                                                <input type="text" className="form-control" placeholder="Latitude" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="* Longitude" id="longitude">
                                                <input type="text" className="form-control" placeholder="Longitude" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row form-subheading">
                                        <h3>Land Attributes</h3>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="* Expansion Area" id="expansion_area">
                                                <input type="text" className="form-control" placeholder="Expansion Area" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="* Total Acreage" id="total_acreage">
                                                <input type="number" className="form-control" placeholder="Total Acreage" />
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
                                        <h3>Dues and Calculations</h3>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="* Sewer Fees Due" id="sewer_due">
                                                <input type="number" className="form-control" placeholder="Sewer Fees Due" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="* Non-Sewer Fees Due" id="non_sewer_due">
                                                <input type="number" className="form-control" placeholder="Non-Sewer Fees Due" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <FormGroup label="* Calculation Notes" id="calculation_note">
                                                <textarea type="text" className="form-control" placeholder="Calculation Notes" rows="4" />
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
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="* Plat Type" id="plat_type">
                                                <input type="text" className="form-control" placeholder="Plat Type" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="* Section" id="section">
                                                <input type="text" className="form-control" placeholder="Section" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="* Unit" id="unit">
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

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(formInit());
            dispatch(getSubdivisions());
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
        onSubmit(event) {
            event.preventDefault();
            dispatch(postPlat())
            .then(() => {
                hashHistory.push('plat/existing/');
            });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlatForm);

