import React from 'react';
import { connect } from 'react-redux';
import {
    // Link,
    hashHistory,
} from 'react-router';
import { map, filter } from 'ramda';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Notes from './Notes';
import Uploads from './Uploads';
import LoadingScreen from './LoadingScreen';

import FormGroup from './FormGroup';
import DeclineDelete from './DeclineDelete';

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
    getAccounts,
    getAccountID,
    getLots,
} from '../actions/apiActions';

class LotForm extends React.Component {
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
            selectedLot,
            showExactions,
            hideExactions,
            currentUser,
        } = this.props;

        const currentParam = this.props.params.id;

        const currentLot = lots && lots.length > 0 &&
            filter(lot => lot.id === parseInt(selectedLot, 10))(lots)[0];

        const platsList = plats && plats.length > 0 &&
            (map((single_plat) => {
                const cabinet = single_plat.cabinet ? `${single_plat.cabinet}-` : '';
                const slide = single_plat.slide ? single_plat.slide : single_plat.name;
                return (
                    <option key={single_plat.id} value={[single_plat.id, single_plat.name]} >
                        {cabinet}{slide}
                    </option>
                );
            })(plats));

        const accountsList = accounts && accounts.length > 0 &&
            (map((single_account) => {
                return (
                    <option key={single_account.id} value={[single_account.id, single_account.account_name]} >
                        {single_account.account_name}
                    </option>
                );
            })(accounts));

        const ownerDisabled =
            activeForm.dues_roads_own &&
            activeForm.dues_roads_own === '0.00' &&
            activeForm.dues_parks_own === '0.00' &&
            activeForm.dues_storm_own === '0.00' &&
            activeForm.dues_open_space_own === '0.00' &&
            activeForm.dues_sewer_cap_own === '0.00' &&
            activeForm.dues_sewer_trans_own === '0.00';

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
                        {activeForm.loading ? <LoadingScreen /> :
                        (

                            <div className="col-md-offset-1 col-md-10 panel-group" id="accordion" role="tablist" aria-multiselectable="false">
                                {currentParam && lots.is_approved === false && <div className="row"><h1 className="approval-pending">Approval Pending</h1></div>}
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
                                            <h3>General Lot Information</h3>
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
                                        <form className="col-xs-12">
                                            <fieldset>
                                                <div className="row form-subheading">
                                                    <h3>Developer Account</h3>
                                                </div>
                                                <div className="row">
                                                    <div className="col-sm-6 form-group">
                                                        <label htmlFor="account" className="form-label" id="account">Developer Account</label>
                                                        <select className="form-control" id="account" onChange={formChange('account')} value={activeForm.account_show} >
                                                            <option value="start_account">Developer Account</option>
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
                                                        <select className="form-control" id="address_zip" onChange={formChange('address_zip')} value={activeForm.address_zip_show} >
                                                            <option value="start_zip">Zipcode</option>
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
                                                        <select className="form-control" id="plat" onChange={formChange('plat')} value={activeForm.plat_show} >
                                                            <option value="start_plat">Plat</option>
                                                            {platsList}
                                                        </select>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <FormGroup label="* Lot Number" id="lot_number" ariaRequired="true">
                                                            <input type="text" className="form-control" placeholder="Lot Number" />
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
                                                            <input type="text" className="form-control" placeholder="Longitude" />
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
                                                            <input type="text" className="form-control" placeholder="Permit ID" onFocus={showExactions} onBlur={hideExactions} />
                                                        </FormGroup>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-sm-6">
                                                        <FormGroup label="Certificate of Occupancy" id="certificate_of_occupancy_final">
                                                            <input type="date" className="form-control" placeholder="Certificate of Occupancy" onFocus={showExactions} onBlur={hideExactions} />
                                                        </FormGroup>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-xs-12">
                                                        {/* {activeForm.show_exactions && currentLot && currentLot.lot_exactions && currentLot.lot_exactions.current_exactions_number > 0 &&
                                                            <h3 className="help-block alert alert-danger text-center">&nbsp;There are still {currentLot.lot_exactions.current_exactions} in exactions due on this lot.</h3>
                                                        } */}
                                                    </div>
                                                </div>
                                            </fieldset>
                                            <div className="row">
                                                <div className="col-xs-6 text-center">
                                                    <button disabled={!submitEnabled} className="btn btn-lex" onClick={onLotSubmit} >
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
                                                <div className="col-xs-6 text-center">
                                                    <DeclineDelete currentForm="/lot/" selectedEntry={selectedLot} parentRoute="lot" />
                                                </div>
                                            </div>
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
                                                    <h3>Lot Exactions</h3>
                                                </div>
                                            </div>
                                        </a>
                                        <div
                                          id="collapseLotExactions"
                                          className="panel-collapse collapse row"
                                          role="tabpanel"
                                          aria-labelledby="#headingLotExactions"
                                        >
                                            <div className="panel-body">
                                                <form >
                                                    <fieldset>
                                                        <div className="row form-subheading">
                                                            <h3>Exactions</h3>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-sm-6">
                                                                <FormGroup label="Road Developer Exactions" id="dues_roads_dev">
                                                                    <input
                                                                      type="number"
                                                                      step="0.01"
                                                                      className="form-control"
                                                                      placeholder="Road Developer Exactions"
                                                                    />
                                                                </FormGroup>
                                                            </div>
                                                            <div className="col-sm-6">
                                                                <FormGroup label="Road Owner Exactions" id="dues_roads_own">
                                                                    <input
                                                                      type="number"
                                                                      step="0.01"
                                                                      className="form-control"
                                                                      placeholder="Road Owner Exactions"
                                                                      disabled={ownerDisabled}
                                                                    />
                                                                </FormGroup>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-sm-6">
                                                                <FormGroup label="Sewer Transmission Developer Exactions" id="dues_sewer_trans_dev">
                                                                    <input
                                                                      type="number"
                                                                      step="0.01"
                                                                      className="form-control"
                                                                      placeholder="Sewer Transmission Developer Exactions"
                                                                    />
                                                                </FormGroup>
                                                            </div>
                                                            <div className="col-sm-6">
                                                                <FormGroup label="Sewer Transmission Owner Exactions" id="dues_sewer_trans_own">
                                                                    <input
                                                                      type="number"
                                                                      step="0.01"
                                                                      className="form-control"
                                                                      placeholder="Sewer Transmission Owner Exactions"
                                                                      disabled={ownerDisabled}
                                                                    />
                                                                </FormGroup>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-sm-6">
                                                                <FormGroup label="Sewer Capacity Developer Exactions" id="dues_sewer_cap_dev">
                                                                    <input
                                                                      type="number"
                                                                      step="0.01"
                                                                      className="form-control"
                                                                      placeholder="Sewer Capacity Developer Exactions"
                                                                    />
                                                                </FormGroup>
                                                            </div>
                                                            <div className="col-sm-6">
                                                                <FormGroup label="Sewer Capacity Owner Exactions" id="dues_sewer_cap_own">
                                                                    <input
                                                                      type="number"
                                                                      step="0.01"
                                                                      className="form-control"
                                                                      placeholder="Sewer Capacity Owner Exactions"
                                                                      disabled={ownerDisabled}
                                                                    />
                                                                </FormGroup>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-sm-6">
                                                                <FormGroup label="Parks Developer Exactions" id="dues_parks_dev">
                                                                    <input
                                                                      type="number"
                                                                      step="0.01"
                                                                      className="form-control"
                                                                      placeholder="Parks Developer Exactions"
                                                                    />
                                                                </FormGroup>
                                                            </div>
                                                            <div className="col-sm-6">
                                                                <FormGroup label="Parks Owner Exactions" id="dues_parks_own">
                                                                    <input
                                                                      type="number"
                                                                      step="0.01"
                                                                      className="form-control"
                                                                      placeholder="Parks Owner Exactions"
                                                                      disabled={ownerDisabled}
                                                                    />
                                                                </FormGroup>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-sm-6">
                                                                <FormGroup label="Storm Developer Exactions" id="dues_storm_dev">
                                                                    <input
                                                                      type="number"
                                                                      step="0.01"
                                                                      className="form-control"
                                                                      placeholder="Storm Developer Exactions"
                                                                    />
                                                                </FormGroup>
                                                            </div>
                                                            <div className="col-sm-6">
                                                                <FormGroup label="Storm Owner Exactions" id="dues_storm_own">
                                                                    <input
                                                                      type="number"
                                                                      step="0.01"
                                                                      className="form-control"
                                                                      placeholder="Storm Owner Exactions"
                                                                      disabled={ownerDisabled}
                                                                    />
                                                                </FormGroup>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-sm-6">
                                                                <FormGroup label="Open Space Developer Exactions" id="dues_open_space_dev">
                                                                    <input
                                                                      type="number"
                                                                      step="0.01"
                                                                      className="form-control"
                                                                      placeholder="Open Space Developer Exactions"
                                                                    />
                                                                </FormGroup>
                                                            </div>
                                                            <div className="col-sm-6">
                                                                <FormGroup label="Open Space Owner Exactions" id="dues_open_space_own">
                                                                    <input
                                                                      type="number"
                                                                      step="0.01"
                                                                      className="form-control"
                                                                      placeholder="Open Space Owner Exactions"
                                                                      disabled={ownerDisabled}
                                                                    />
                                                                </FormGroup>
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                    <div className="col-xs-6 text-center">
                                                        <button disabled={!submitEnabled} className="btn btn-lex" onClick={onLotDues} >Submit</button>
                                                        {!submitEnabled ? (
                                                            <div>
                                                                <div className="clearfix" />
                                                                <span> * All required fields must be filled.</span>
                                                            </div>
                                                        ) : null
                                                        }
                                                    </div>
                                                    <div className="col-xs-6 text-center">
                                                        <DeclineDelete currentForm="/lot/" selectedEntry={selectedLot} parentRoute="lot" />
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                                {currentLot && currentLot.id &&
                                    <Notes
                                      content_type="plats_lot"
                                      object_id={currentLot.id}
                                      ariaExpanded="true"
                                      panelClass="panel-collapse collapse row in"
                                      permission="lot"
                                    />
                                }
                                <div className="clearfix" />
                                {currentLot && currentLot.id &&
                                    <Uploads
                                      file_content_type="plats_lot"
                                      file_object_id={currentLot.id}
                                      ariaExpanded="true"
                                      panelClass="panel-collapse collapse row in"
                                      permission="lot"
                                    />
                                }
                            </div>
                        )}
                    </div>
                </div>

                <Footer />
            </div>
        );
    }
}

LotForm.propTypes = {
    activeForm: PropTypes.object,
    plats: PropTypes.array,
    lots: PropTypes.array,
    accounts: PropTypes.array,
    route: PropTypes.object,
    params: PropTypes.object,
    onComponentDidMount: PropTypes.func,
    formChange: PropTypes.func,
    onLotSubmit: PropTypes.func,
    onLotDues: PropTypes.func,
    showExactions: PropTypes.func,
    hideExactions: PropTypes.func,
    selectedLot: PropTypes.string,
    currentUser: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        activeForm: state.activeForm,
        plats: state.plats,
        lots: state.lots,
        accounts: state.accounts,
        currentUser: state.currentUser,
    };
}

function mapDispatchToProps(dispatch, params) {
    const params_location = params.location.pathname;
    const selectedLot = ((params_location.indexOf('plat') !== -1)) ? null : (params.params.id);
    const plat_start = ((params_location.indexOf('plat') !== -1)) ? (params.params.id) : null;

    return {
        onComponentDidMount() {
            dispatch(formInit());
            dispatch(formUpdate({ loading: true }));
            if (selectedLot) {
                dispatch(getLotID(selectedLot))
                .then((data_lot) => {
                    const update = {
                        plat: data_lot.response && data_lot.response.plat ? data_lot.response.plat.id : null,
                        plat_show: data_lot.response && data_lot.response.plat ? `${data_lot.response.plat.id},${data_lot.response.plat.name}` : '',
                        address_number: data_lot.response.address_number,
                        address_street: data_lot.response.address_street,
                        address_direction: data_lot.response.address_direction,
                        address_unit: data_lot.response.address_unit,
                        address_suffix: data_lot.response.address_suffix,
                        address_city: data_lot.response.address_city,
                        address_state: data_lot.response.address_state,
                        address_zip: data_lot.response.address_zip,
                        address_zip_show: `${data_lot.response.address_zip},${data_lot.response.address_zip}`,
                        lot_number: data_lot.response.lot_number,
                        parcel_id: data_lot.response.parcel_id,
                        permit_id: data_lot.response.permit_id,
                        certificate_of_occupancy_final: data_lot.response.certificate_of_occupancy_final,
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
                                account: data_account_id.response.id,
                                account_show: `${data_account_id.response.id},${data_account_id.response.account_name}`,
                            };
                            dispatch(formUpdate(update_lot_account));
                            dispatch(getAccounts());
                        });
                    } else if (data_lot.response.plat && data_lot.response.plat.account) {
                        dispatch(getAccountID(data_lot.response.plat.account))
                        .then((data_plat_account_id) => {
                            const update_account = {
                                account: data_plat_account_id.response.id,
                                account_show: `${data_plat_account_id.response.id},${data_plat_account_id.response.account_name}`,
                            };
                            dispatch(formUpdate(update_account));
                            dispatch(getAccounts());
                        });
                    }
                });
            } else {
                const else_update = {
                    first_section: false,
                    account_show: '',
                    plat_show: '',
                    address_zip_show: '',
                };
                dispatch(formUpdate(else_update));
            }
            dispatch(getLots());
            dispatch(getPlats())
            .then((all_plats) => {
                dispatch(formUpdate({ loading: false }));
                if (plat_start) {
                    const plat_start_number = parseInt(plat_start, 10);
                    const matching_plats = all_plats.response.filter(plat => (plat.id === plat_start_number));

                    if (matching_plats.length > 0) {
                        const starting_plat = matching_plats[0];
                        const plat_update = {
                            plat: starting_plat.id,
                            plat_name: starting_plat.name,
                            first_section: false,
                            account_show: '',
                            plat_show: `${starting_plat.id},${starting_plat.name}`,
                            address_zip_show: '',
                        };
                        dispatch(formUpdate(plat_update));
                    }
                }
            });
            dispatch(getAccounts());
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
        onLotSubmit(event) {
            event.preventDefault();
            if (selectedLot) {
                dispatch(putLot(selectedLot))
                .then(() => {
                    hashHistory.push(`lot/summary/${selectedLot}`);
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
                hashHistory.push(`lot/summary/${selectedLot}`);
            }
        },
        showExactions() {
            dispatch(formUpdate({ show_exactions: true }));
        },
        hideExactions() {
            dispatch(formUpdate({ show_exactions: false }));
        },
        selectedLot,
        plat_start,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LotForm);

