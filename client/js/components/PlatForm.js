import React from 'react';
import { connect } from 'react-redux';
import {
    Link,
} from 'react-router';

import Navbar from './Navbar';
import Footer from './Footer';

import FormGroup from './FormGroup';

import {
    formInit,
    formUpdate,
} from '../actions/formActions';

import {
    getPlatID,
    postPlat,
    putPlat,
} from '../actions/apiActions';

class PlatForm extends React.Component {
    static propTypes = {
        activeForm: React.PropTypes.object,
        plats: React.PropTypes.object,
        onSubmit: React.PropTypes.func,
    };

    render() {
        const {
            activeForm,
            plats,
            onSubmit,
        } = this.props;

        const submitEnabled =
            activeForm.total_acreage &&
            activeForm.latitude &&
            activeForm.longitute &&
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
                        <h1>PLATS - CREATE / APPLY</h1>
                    </div>
                </div>
                <div className="inside-body">
                    <div className="container">
                        <div className="col-sm-offset-1 col-sm-10">
                            <form onSubmit={onSubmit} >

                                <fieldset>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="Subdivision" id="subdivision">
                                                <input type="text" className="form-control" placeholder="Subdivision" autoFocus />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="Latitude" id="latitude">
                                                <input type="text" className="form-control" placeholder="Latitude" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="Longitude" id="longitute">
                                                <input type="text" className="form-control" placeholder="Longitude" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="Expansion Area" id="expansion_area">
                                                <input type="text" className="form-control" placeholder="Expansion Area" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="* Total Acreage" id="total_acreage">
                                                <input type="text" className="form-control" placeholder="Total Acreage" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="Buildable Lots" id="buildable_lots">
                                                <input type="text" className="form-control" placeholder="Buildable Lots" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="Non-Buildable Lots" id="non_buildable_lots">
                                                <input type="text" className="form-control" placeholder="Non-Buildable Lots" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="Plat Type" id="plat_type">
                                                <input type="text" className="form-control" placeholder="Plat Type" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="Section" id="section">
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
                                            <FormGroup label="Block" id="block">
                                                <input type="text" className="form-control" placeholder="Block" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="Cabinet" id="cabinet">
                                                <input type="text" className="form-control" placeholder="Cabinet" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="Slide" id="slide">
                                                <input type="text" className="form-control" placeholder="Slide" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="Sewer Fees Due" id="sewer_due">
                                                <input type="text" className="form-control" placeholder="Sewer Fees Due" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="Non-Sewer Fees Due" id="non_sewer_due">
                                                <input type="text" className="form-control" placeholder="Non-Sewer Fees Due" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <FormGroup label="Calculation Notes" id="calculation_note">
                                            <input type="text" className="form-control" placeholder="Calculation Notes" />
                                        </FormGroup>
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
        plats: state.plats,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onSubmit(event) {
            event.preventDefault();
            dispatch(postPlat());
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlatForm);

