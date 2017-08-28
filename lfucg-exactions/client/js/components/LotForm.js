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
import Notes from './Notes';

import FormGroup from './FormGroup';

import {
    formInit,
    formUpdate,
} from '../actions/formActions';

import {
    getMe,
    getLotID,
    postLot,
    putLot,
    getPlats,
    getPlatID,
    getAccounts,
    getAccountID,
} from '../actions/apiActions';

class LotForm extends React.Component {
    static propTypes = {
        activeForm: React.PropTypes.object,
        plats: React.PropTypes.object,
        lots: React.PropTypes.object,
        accounts: React.PropTypes.object,
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
            accounts,
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

        const accountsList = accounts.length > 0 ? (map((single_account) => {
            return (
                <option key={single_account.id} value={[single_account.id, single_account.account_name]} >
                    {single_account.account_name}
                </option>
            );
        })(accounts)) : null;

        const ownerDisabled =
            lots &&
            lots.dues_roads_own &&
            lots.dues_roads_own === '0.00' &&
            lots.dues_parks_own === '0.00' &&
            lots.dues_storm_own === '0.00' &&
            lots.dues_open_space_own === '0.00' &&
            lots.dues_sewer_cap_own === '0.00' &&
            lots.dues_sewer_trans_own === '0.00';

        const submitEnabled =
            activeForm.plat !== 'choose_plat' &&
            activeForm.lot_number &&
            activeForm.address_number &&
            activeForm.address_street;

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
                                    <div className="col-xs-1 caret-indicator" />
                                    <div className="col-xs-10">
                                        <h2>General Lot Information</h2>
                                    </div>
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
                                                <h3>Account</h3>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6 form-group">
                                                    <label htmlFor="account" className="form-label" id="account">Account</label>
                                                    <select className="form-control" id="account" onChange={formChange('account')} >
                                                        {activeForm.account_name ? (
                                                            <option value="choose_account" aria-label="Selected Account">
                                                                {activeForm.account_name}
                                                            </option>
                                                        ) : (
                                                            <option value="choose_account" aria-label="Select an Account">
                                                                Select an Account
                                                            </option>
                                                        )}
                                                        {accountsList}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="row form-subheading">
                                                <h3>Address</h3>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-4">
                                                    <FormGroup label="* Address Number" id="address_number" aria-required="true">
                                                        <input type="number" className="form-control" placeholder="Address Number" autoFocus />
                                                    </FormGroup>
                                                </div>
                                                <div className="col-sm-8">
                                                    <FormGroup label="* Street" id="address_street" aria-required="true">
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
                                                    <FormGroup label="City" id="address_city">
                                                        <input type="text" className="form-control" placeholder="Lexington" disabled value="Lexington" />
                                                    </FormGroup>
                                                </div>
                                                <div className="col-sm-4 form-group">
                                                    <FormGroup label="State" id="address_state">
                                                        <input type="text" className="form-control" placeholder="Kentucky" disabled value="KY" />
                                                    </FormGroup>
                                                </div>
                                                <div className="col-sm-3 form-group">
                                                    <label htmlFor="address_zip" className="form-label" id="address_zip">Zipcode</label>
                                                    <select className="form-control" id="address_zip" onChange={formChange('address_zip')} >
                                                        {lots.address_zip ? (
                                                            <option value="address_zip" aria-label={`Zipcode ${lots.address_zip}`}>{lots.address_zip}</option>
                                                        ) : (
                                                            <option value="choose_zip" aria-label="Zipcode">Zipcode</option>
                                                        )}
                                                        <option value={['40505', '40505']}>40505</option>
                                                        <option value={['40509', '40509']}>40509</option>
                                                        <option value={['40511', '40511']}>40511</option>
                                                        <option value={['40515', '40515']}>40515</option>
                                                        <option value={['40516', '40516']}>40516</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="row form-subheading">
                                                <h3>Location Identification</h3>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6 form-group">
                                                    <label htmlFor="plat" className="form-label" id="plat" aria-required="true">* Plat</label>
                                                    <select className="form-control" id="plat" onChange={formChange('plat')} >
                                                        {lots.plat && lots.plat.id ? (
                                                            <option value="choose_plat" aria-label={lots.plat.name}>
                                                                {lots.plat.name}
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
                                                    <FormGroup label="* Lot Number" id="lot_number" aria-required="true">
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
                                                    <FormGroup label="Permit ID" id="permit_id">
                                                        <input type="text" className="form-control" placeholder="Permit ID" />
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
                                                    <FormGroup label="Longitude" id="longitude">
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
                                <div>
                                    <a
                                      role="button"
                                      data-toggle="collapse"
                                      data-parent="#accordion"
                                      href="#collapseLotExactions"
                                      aria-expanded="false"
                                      aria-controls="collapseLotExactions"
                                    >
                                        <div className="row section-heading" role="tab" id="headingLotExactions">
                                            <div className="col-xs-1 caret-indicator" />
                                            <div className="col-xs-10">
                                                <h2>Lot Exactions</h2>
                                            </div>
                                        </div>
                                    </a>
                                    <div
                                      id="collapseLotExactions"
                                      className="panel-collapse collapse in row"
                                      role="tabpanel"
                                      aria-labelledby="#headingLotExactions"
                                    >
                                        <div className="panel-body">
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
                                                                <input type="number" className="form-control" placeholder="Road Owner Exactions" disabled={ownerDisabled} />
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
                                                                <input type="number" className="form-control" placeholder="Sewer Transmission Owner Exactions" disabled={ownerDisabled} />
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
                                                                <input type="number" className="form-control" placeholder="Sewer Capacity Owner Exactions" disabled={ownerDisabled} />
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
                                                                <input type="number" className="form-control" placeholder="Parks Owner Exactions" disabled={ownerDisabled} />
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
                                                                <input type="number" className="form-control" placeholder="Storm Owner Exactions" disabled={ownerDisabled} />
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
                                                                <input type="number" className="form-control" placeholder="Open Space Owner Exactions" disabled={ownerDisabled} />
                                                            </FormGroup>
                                                        </div>
                                                    </div>
                                                </fieldset>
                                                <button className="btn btn-lex" >Submit</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
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
                                        {lots.id && lots.plat &&
                                            <Notes content_type="Lot" object_id={lots.id} parent_content_type="Plat" parent_object_id={lots.plat.id} />
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
        plats: state.plats,
        lots: state.lots,
        accounts: state.accounts,
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
            dispatch(getAccounts());
            dispatch(getMe())
            .then((data_me) => {
                if (data_me.error) {
                    hashHistory.push('login/');
                }
                if (selectedLot) {
                    dispatch(getLotID(selectedLot))
                    .then((data_lot) => {
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
                        if (data_lot.response.account) {
                            dispatch(getAccountID(data_lot.response.account))
                            .then((data_account_id) => {
                                const update_lot_account = {
                                    account_name: data_account_id.response.account_name,
                                };
                                dispatch(formUpdate(update_lot_account));
                            });
                        } else if (data_lot.response.plat && data_lot.response.plat.account) {
                            dispatch(getAccountID(data_lot.response.plat.account))
                            .then((data_plat_account_id) => {
                                const update_account = {
                                    account_name: data_plat_account_id.response.account_name,
                                };
                                dispatch(formUpdate(update_account));
                            });
                        }
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
                dispatch(putLot(selectedLot))
                .then(() => {
                    hashHistory.push('lot/');
                });
            }
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LotForm);

