import React from 'react';
import { connect } from 'react-redux';
import {
    Link,
    hashHistory,
} from 'react-router';
import { map } from 'ramda';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

import FormGroup from './FormGroup';

import {
    formInit,
    formUpdate,
} from '../actions/formActions';

import {
    getLotID,
    postLot,
    putLot,
    getPlats,
    getPlatID,
} from '../actions/apiActions';

class LotForm extends React.Component {
    static propTypes = {
        activeForm: React.PropTypes.object,
        plats: React.PropTypes.object,
        lots: React.PropTypes.object,
        route: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
        formChange: React.PropTypes.func,
        onLotSubmit: React.PropTypes.func,
        onLotDues: React.PropTypes.func,
    };

    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            activeForm,
            plats,
            lots,
            formChange,
            onLotSubmit,
            onLotDues,
        } = this.props;

        const platsList = plats.length > 0 ? (map((single_plat) => {
            return (
                <option key={single_plat.id} value={[single_plat.id, single_plat.name]} >
                    {single_plat.name}
                </option>
            );
        })(plats)) : null;

        const submitEnabled =
            activeForm.plat !== 'choose_plat' &&
            activeForm.lot_number &&
            activeForm.permit_id &&
            activeForm.latitude &&
            activeForm.longitude &&
            activeForm.address_number &&
            activeForm.address_street &&
            activeForm.address_city &&
            activeForm.address_state !== 'start_state' &&
            activeForm.address_zip;

        return (
            <div className="lot-form">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>LOTS - CREATE / APPLY</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'lot'} parent_name={'Lots'} />

                <div className="inside-body">
                    <div className="container">
                        <div className="col-md-offset-1 col-md-10 panel-group" id="accordion" role="tablist" aria-multiselectable="false">
                            <a
                              role="button"
                              data-toggle="collapse"
                              data-parent="#accordion"
                              href="#collapseGeneralLot"
                              aria-expanded="false"
                              aria-controls="collapseGeneralLot"
                            >
                                <div className="row section-heading" role="tab" id="headingLot">
                                    <h2>General Lot Information</h2>
                                    {activeForm.first_section ?
                                        <h4>(Click to View or Edit)</h4>
                                    : null}
                                </div>
                            </a>
                            <div
                              id="collapseGeneralLot"
                              className={activeForm.first_section ? 'panel-collapse collapse row' : 'panel-collapse row'}
                              role="tabpanel"
                              aria-labelledby="#headingLot"
                            >
                                <div className="panel-body">
                                    <form onSubmit={onLotSubmit} >

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
                                                    <FormGroup label="Street Direction" id="address_direction">
                                                        <input type="text" className="form-control" placeholder="Street Direction" />
                                                    </FormGroup>
                                                </div>
                                                <div className="col-sm-4">
                                                    <FormGroup label="Unit" id="address_unit">
                                                        <input type="text" className="form-control" placeholder="Unit" />
                                                    </FormGroup>
                                                </div>
                                                <div className="col-sm-4">
                                                    <FormGroup label="Street Suffix" id="address_suffix">
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
                                                <div className="col-sm-4 form-group">
                                                    <label htmlFor="address_state" className="form-label" id="address_state">* State</label>
                                                    <select className="form-control" onChange={formChange('address_state')} >
                                                        <option value="start_state">State</option>
                                                        <option value={['AK', 'Alaska']}>Alaska</option>
                                                        <option value={['AL', 'Alabama']}>Alabama</option>
                                                        <option value={['AR', 'Arkansas']}>Arkansas</option>
                                                        <option value={['AS', 'American Samoa']}>American Samoa</option>
                                                        <option value={['AZ', 'Arizona']}>Arizona</option>
                                                        <option value={['CA', 'California']}>California</option>
                                                        <option value={['CO', 'Colorado']}>Colorado</option>
                                                        <option value={['CT', 'Connecticut']}>Connecticut</option>
                                                        <option value={['DC', 'District of Columbia']}>District of Columbia</option>
                                                        <option value={['DE', 'Delaware']}>Delaware</option>
                                                        <option value={['FL', 'Florida']}>Florida</option>
                                                        <option value={['GA', 'Georgia']}>Georgia</option>
                                                        <option value={['GU', 'Guam']}>Guam</option>
                                                        <option value={['HI', 'Hawaii']}>Hawaii</option>
                                                        <option value={['IA', 'Iowa']}>Iowa</option>
                                                        <option value={['ID', 'Idaho']}>Idaho</option>
                                                        <option value={['IL', 'Illinois']}>Illinois</option>
                                                        <option value={['IN', 'Indiana']}>Indiana</option>
                                                        <option value={['KS', 'Kansas']}>Kansas</option>
                                                        <option value={['KY', 'Kentucky']}>Kentucky</option>
                                                        <option value={['LA', 'Louisiana']}>Louisiana</option>
                                                        <option value={['MA', 'Massachusetts']}>Massachusetts</option>
                                                        <option value={['MD', 'Maryland']}>Maryland</option>
                                                        <option value={['ME', 'Maine']}>Maine</option>
                                                        <option value={['MI', 'Michigan']}>Michigan</option>
                                                        <option value={['MN', 'Minnesota']}>Minnesota</option>
                                                        <option value={['MO', 'Missouri']}>Missouri</option>
                                                        <option value={['MP', 'Northern Mariana Islands']}>Northern Mariana Islands</option>
                                                        <option value={['MS', 'Mississippi']}>Mississippi</option>
                                                        <option value={['MT', 'Montana']}>Montana</option>
                                                        <option value={['NA', 'National']}>National</option>
                                                        <option value={['NC', 'North Carolina']}>North Carolina</option>
                                                        <option value={['ND', 'North Dakota']}>North Dakota</option>
                                                        <option value={['NE', 'Nebraska']}>Nebraska</option>
                                                        <option value={['NH', 'New Hampshire']}>New Hampshire</option>
                                                        <option value={['NJ', 'New Jersey']}>New Jersey</option>
                                                        <option value={['NM', 'New Mexico']}>New Mexico</option>
                                                        <option value={['NV', 'Nevada']}>Nevada</option>
                                                        <option value={['NY', 'New York']}>New York</option>
                                                        <option value={['OH', 'Ohio']}>Ohio</option>
                                                        <option value={['OK', 'Oklahoma']}>Oklahoma</option>
                                                        <option value={['OR', 'Oregon']}>Oregon</option>
                                                        <option value={['PA', 'Pennsylvania']}>Pennsylvania</option>
                                                        <option value={['PR', 'Puerto Rico']}>Puerto Rico</option>
                                                        <option value={['RI', 'Rhode Island']}>Rhode Island</option>
                                                        <option value={['SC', 'South Carolina']}>South Carolina</option>
                                                        <option value={['SD', 'South Dakota']}>South Dakota</option>
                                                        <option value={['TN', 'Tennessee']}>Tennessee</option>
                                                        <option value={['TX', 'Texas']}>Texas</option>
                                                        <option value={['UT', 'Utah']}>Utah</option>
                                                        <option value={['VA', 'Virginia']}>Virginia</option>
                                                        <option value={['VI', 'Virgin Islands']}>Virgin Islands</option>
                                                        <option value={['VT', 'Vermont']}>Vermont</option>
                                                        <option value={['WA', 'Washington']}>Washington</option>
                                                        <option value={['WI', 'Wisconsin']}>Wisconsin</option>
                                                        <option value={['WV', 'West Virginia']}>West Virginia</option>
                                                        <option value={['WY', 'Wyoming']}>Wyoming</option>
                                                    </select>
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
                                                <div className="col-sm-6 form-group">
                                                    <label htmlFor="plat" className="form-label" id="plat">* Plat</label>
                                                    <select className="form-control" id="plat" onChange={formChange('plat')} >
                                                        {activeForm.plat ? (
                                                            <option value="choose_plat" aria-label={activeForm.plat_name}>
                                                                {activeForm.plat_name}
                                                            </option>
                                                        ) : (
                                                            <option value="choose_plat" aria-label="Select a Plat">
                                                                Select a Plat
                                                            </option>
                                                        )}
                                                        {platsList}
                                                    </select>
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
                                <form onSubmit={onLotDues} >
                                    <fieldset>
                                        <div className="row form-subheading">
                                            <h3>Exactions</h3>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <FormGroup label="Road Developer Exactions" id="dues_roads_dev">
                                                    <input type="number" className="form-control" placeholder="Road Developer Exactions" />
                                                </FormGroup>
                                            </div>
                                            <div className="col-sm-6">
                                                <FormGroup label="Road Owner Exactions" id="dues_roads_own">
                                                    <input type="number" className="form-control" placeholder="Road Owner Exactions" />
                                                </FormGroup>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <FormGroup label="Sewer Transmission Developer Exactions" id="dues_sewer_trans_dev">
                                                    <input type="number" className="form-control" placeholder="Sewer Transmission Developer Exactions" />
                                                </FormGroup>
                                            </div>
                                            <div className="col-sm-6">
                                                <FormGroup label="Sewer Transmission Owner Exactions" id="dues_sewer_trans_own">
                                                    <input type="number" className="form-control" placeholder="Sewer Transmission Owner Exactions" />
                                                </FormGroup>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <FormGroup label="Sewer Capacity Developer Exactions" id="dues_sewer_cap_dev">
                                                    <input type="number" className="form-control" placeholder="Sewer Capacity Developer Exactions" />
                                                </FormGroup>
                                            </div>
                                            <div className="col-sm-6">
                                                <FormGroup label="Sewer Capacity Owner Exactions" id="dues_sewer_cap_own">
                                                    <input type="number" className="form-control" placeholder="Sewer Capacity Owner Exactions" />
                                                </FormGroup>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <FormGroup label="Parks Developer Exactions" id="dues_parks_dev">
                                                    <input type="number" className="form-control" placeholder="Parks Developer Exactions" />
                                                </FormGroup>
                                            </div>
                                            <div className="col-sm-6">
                                                <FormGroup label="Parks Owner Exactions" id="dues_parks_own">
                                                    <input type="number" className="form-control" placeholder="Parks Owner Exactions" />
                                                </FormGroup>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <FormGroup label="Storm Developer Exactions" id="dues_storm_dev">
                                                    <input type="number" className="form-control" placeholder="Storm Developer Exactions" />
                                                </FormGroup>
                                            </div>
                                            <div className="col-sm-6">
                                                <FormGroup label="Storm Owner Exactions" id="dues_storm_own">
                                                    <input type="number" className="form-control" placeholder="Storm Owner Exactions" />
                                                </FormGroup>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <FormGroup label="Open Space Developer Exactions" id="dues_open_space_dev">
                                                    <input type="number" className="form-control" placeholder="Open Space Developer Exactions" />
                                                </FormGroup>
                                            </div>
                                            <div className="col-sm-6">
                                                <FormGroup label="Open Space Owner Exactions" id="dues_open_space_own">
                                                    <input type="number" className="form-control" placeholder="Open Space Owner Exactions" />
                                                </FormGroup>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <button className="btn btn-lex" >Submit</button>
                                </form>
                            ) : null}
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
        lots: state.lots,
    };
}

function mapDispatchToProps(dispatch, params) {
    const params_location = params.location.pathname;
    const selectedLot = (params_location.includes('plat')) ? null : (params.params.id);
    const plat_start = (params_location.includes('plat')) ? (params.params.id) : null;

    return {
        onComponentDidMount() {
            dispatch(formInit());
            dispatch(getPlats());
            if (selectedLot) {
                dispatch(getLotID(selectedLot))
                .then((data_lot) => {
                    if (data_lot.response.plat) {
                        dispatch(getPlatID(data_lot.response.plat))
                        .then((data_plat_id) => {
                            const update2 = {
                                plat_name: data_plat_id.response.name,
                            };
                            dispatch(formUpdate(update2));
                        });
                    }
                    const update = {
                        address_number: data_lot.response.address_number,
                        address_street: data_lot.response.address_street,
                        address_direction: data_lot.response.address_direction,
                        address_unit: data_lot.response.address_unit,
                        address_suffix: data_lot.response.address_suffix,
                        address_city: data_lot.response.address_city,
                        address_state: data_lot.response.address_state,
                        address_zip: data_lot.response.address_zip,
                        plat: data_lot.response.plat,
                        lot_number: data_lot.response.lot_number,
                        parcel_id: data_lot.response.parcel_id,
                        permit_id: data_lot.response.permit_id,
                        latitude: data_lot.response.latitude,
                        longitude: data_lot.response.longitude,
                        dues_roads_dev: data_lot.response.dues_roads_dev,
                        dues_roads_own: data_lot.response.dues_roads_own,
                        dues_sewer_trans_dev: data_lot.response.dues_sewer_trans_dev,
                        dues_sewer_trans_own: data_lot.response.dues_sewer_trans_own,
                        dues_sewer_cap_dev: data_lot.response.dues_sewer_cap_dev,
                        dues_sewer_cap_own: data_lot.response.dues_sewer_cap_own,
                        dues_parks_dev: data_lot.response.dues_parks_dev,
                        dues_parks_own: data_lot.response.dues_parks_own,
                        dues_storm_dev: data_lot.response.dues_storm_dev,
                        dues_storm_own: data_lot.response.dues_storm_own,
                        dues_open_space_dev: data_lot.response.dues_open_space_dev,
                        dues_open_space_own: data_lot.response.dues_open_space_own,
                        first_section: true,
                    };
                    dispatch(formUpdate(update));
                });
            } else if (plat_start) {
                dispatch(getPlatID(plat_start))
                .then((data_plat_start) => {
                    const plat_update = {
                        plat: data_plat_start.response.id,
                        plat_name: data_plat_start.response.name,
                        first_section: false,
                    };
                    dispatch(formUpdate(plat_update));
                });
            } else {
                const else_update = {
                    first_section: false,
                };
                dispatch(formUpdate(else_update));
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
        onLotSubmit(event) {
            event.preventDefault();
            if (selectedLot) {
                dispatch(putLot(selectedLot))
                .then((data_put_lot) => {
                    const put_update = {
                        first_section: true,
                        dues_roads_dev: data_put_lot.response.dues_roads_dev,
                        dues_roads_own: data_put_lot.response.dues_roads_own,
                        dues_sewer_trans_dev: data_put_lot.response.dues_sewer_trans_dev,
                        dues_sewer_trans_own: data_put_lot.response.dues_sewer_trans_own,
                        dues_sewer_cap_dev: data_put_lot.response.dues_sewer_cap_dev,
                        dues_sewer_cap_own: data_put_lot.response.dues_sewer_cap_own,
                        dues_parks_dev: data_put_lot.response.dues_parks_dev,
                        dues_parks_own: data_put_lot.response.dues_parks_own,
                        dues_storm_dev: data_put_lot.response.dues_storm_dev,
                        dues_storm_own: data_put_lot.response.dues_storm_own,
                        dues_open_space_dev: data_put_lot.response.dues_open_space_dev,
                        dues_open_space_own: data_put_lot.response.dues_open_space_own,
                    };
                    dispatch(formUpdate(put_update));
                });
            } else {
                dispatch(postLot())
                .then((data_post) => {
                    const post_update = {
                        first_section: true,
                        dues_roads_dev: data_post.response.dues_roads_dev,
                        dues_roads_own: data_post.response.dues_roads_own,
                        dues_sewer_trans_dev: data_post.response.dues_sewer_trans_dev,
                        dues_sewer_trans_own: data_post.response.dues_sewer_trans_own,
                        dues_sewer_cap_dev: data_post.response.dues_sewer_cap_dev,
                        dues_sewer_cap_own: data_post.response.dues_sewer_cap_own,
                        dues_parks_dev: data_post.response.dues_parks_dev,
                        dues_parks_own: data_post.response.dues_parks_own,
                        dues_storm_dev: data_post.response.dues_storm_dev,
                        dues_storm_own: data_post.response.dues_storm_own,
                        dues_open_space_dev: data_post.response.dues_open_space_dev,
                        dues_open_space_own: data_post.response.dues_open_space_own,
                    };
                    dispatch(formUpdate(post_update));
                    hashHistory.push(`lot/form/${data_post.response.id}`);
                });
            }
        },
        onLotDues() {
            if (selectedLot) {
                dispatch(putLot(selectedLot));
            }
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LotForm);

