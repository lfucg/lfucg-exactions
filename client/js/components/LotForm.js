import React from 'react';
import { connect } from 'react-redux';
import {
    Link,
    hashHistory,
} from 'react-router';

import Navbar from './Navbar';
import Footer from './Footer';

import FormGroup from './FormGroup';

import {
    formInit,
    formUpdate,
} from '../actions/formActions';

import {
    getLotID,
    postLot,
    putLot,
} from '../actions/apiActions';

class LotForm extends React.Component {
    static propTypes = {
        activeForm: React.PropTypes.object,
        lots: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
        onSubmit: React.PropTypes.func,
    };

    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            activeForm,
            lots,
            onSubmit,
        } = this.props;

        const submitEnabled =
            activeForm.plat &&
            activeForm.lot_number &&
            activeForm.permit_id &&
            activeForm.latitude &&
            activeForm.longitude &&
            activeForm.address_number &&
            activeForm.address_street &&
            activeForm.address_city &&
            activeForm.address_state &&
            activeForm.address_zip &&
            activeForm.dues_roads_dev &&
            activeForm.dues_roads_own &&
            activeForm.dues_sewer_trans_dev &&
            activeForm.dues_sewer_trans_own &&
            activeForm.dues_sewer_cap_dev &&
            activeForm.dues_sewer_cap_own &&
            activeForm.dues_parks_dev &&
            activeForm.dues_parks_own &&
            activeForm.dues_storm_dev &&
            activeForm.dues_storm_own &&
            activeForm.dues_open_space_dev &&
            activeForm.dues_open_space_own &&
            activeForm.payment;

        return (
            <div className="lot-form">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <div className="col-sm-9">
                            <h1>LOTS - CREATE / APPLY</h1>
                        </div>
                        <div className="col-sm-3">
                            <Link to="lot-page" className="btn btn-lex-reverse" role="link">Return to Lots</Link>
                        </div>
                    </div>
                </div>
                <div className="inside-body">
                    <div className="container">
                        <div className="col-md-offset-1 col-md-10">
                            <form onSubmit={onSubmit} >

                                <fieldset>
                                    <div className="row form-subheading">
                                        <h3>Address</h3>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <FormGroup label="* Address Number" id="address_number">
                                                <input type="number" className="form-control" placeholder="Address Number" autoFocus />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-8">
                                            <FormGroup label="* Street" id="address_street">
                                                <input type="text" className="form-control" placeholder="Street" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <FormGroup label="* Street Direction" id="address_direction">
                                                <input type="text" className="form-control" placeholder="Street Direction" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-4">
                                            <FormGroup label="* Unit" id="address_unit">
                                                <input type="text" className="form-control" placeholder="Unit" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-4">
                                            <FormGroup label="* Street Suffix" id="address_suffix">
                                                <input type="text" className="form-control" placeholder="Street Suffix" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-5">
                                            <FormGroup label="* City" id="address_city">
                                                <input type="text" className="form-control" placeholder="City" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-4">
                                            <FormGroup label="* State" id="address_state">
                                                <input type="dropdown" className="form-control" placeholder="State" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-3">
                                            <FormGroup label="* Zipcode" id="address_zip">
                                                <input type="text" className="form-control" placeholder="Zipcode" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row form-subheading">
                                        <h3>Location Identification</h3>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="* Plat" id="plat">
                                                <input type="text" className="form-control" placeholder="Plat" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="* Lot Number" id="lot_number">
                                                <input type="text" className="form-control" placeholder="Lot Number" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="Parcel ID" id="parcel_id">
                                                <input type="text" className="form-control" placeholder="Parcel ID" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="* Permit ID" id="permit_id">
                                                <input type="text" className="form-control" placeholder="Permit ID" />
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
                                                <input type="text" className="form-control" placeholder="Permit ID" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row form-subheading">
                                        <h3>Dues</h3>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="* Road Development Fees" id="dues_roads_dev">
                                                <input type="number" className="form-control" placeholder="Road Development Fees" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="* Road Own Fees" id="dues_roads_own">
                                                <input type="number" className="form-control" placeholder="Road Own Fees" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="* Sewer Trans. Development Fees" id="dues_sewer_trans_dev">
                                                <input type="number" className="form-control" placeholder="Sewer Trans. Development Fees" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="* Sewer Trans. Own Fees" id="dues_sewer_trans_own">
                                                <input type="number" className="form-control" placeholder="Sewer Trans. Own Fees" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="* Sewer Cap. Development Fees" id="dues_sewer_cap_dev">
                                                <input type="number" className="form-control" placeholder="Sewer Cap. Development Fees" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="* Sewer Cap. Own Fees" id="dues_sewer_cap_own">
                                                <input type="number" className="form-control" placeholder="Sewer Cap. Own Fees" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="* Parks Development Fees" id="dues_parks_dev">
                                                <input type="number" className="form-control" placeholder="Parks Development Fees" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="* Parks Own Fees" id="dues_parks_own">
                                                <input type="number" className="form-control" placeholder="Parks Own Fees" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="* Storm Development Fees" id="dues_storm_dev">
                                                <input type="number" className="form-control" placeholder="Storm Development Fees" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="* Storm Own Fees" id="dues_storm_own">
                                                <input type="number" className="form-control" placeholder="Storm Own Fees" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="* Open Space Development Fees" id="dues_open_space_dev">
                                                <input type="number" className="form-control" placeholder="Open Space Development Fees" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="* Open Space Own Fees" id="dues_open_space_own">
                                                <input type="number" className="form-control" placeholder="Open Space Own Fees" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="* Payment" id="payment">
                                                <input type="number" className="form-control" placeholder="Payment" />
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
        lots: state.lots,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(formInit());
        },
        onSubmit(event) {
            event.preventDefault();
            dispatch(postLot())
            .then(() => {
                hashHistory.push('lot-existing/');
            });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LotForm);

