import React from 'react';
import { connect } from 'react-redux';
import {
    hashHistory,
} from 'react-router';
import { map, filter } from 'ramda';
import PropTypes from 'prop-types';
import { Typeahead } from 'react-bootstrap-typeahead';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import LoadingScreen from './LoadingScreen';

import FormGroup from './FormGroup';
import DeclineDelete from './DeclineDelete';
import Notes from './Notes';

import {
    formInit,
    formUpdate,
} from '../actions/formActions';

import {
    getLots,
    getLotID,
    getAccounts,
    getAccountID,
    getAccountAgreements,
    getAgreements,
    getPaymentID,
    postPayment,
    putPayment,
    getNoteContent,
} from '../actions/apiActions';

class PaymentForm extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            activeForm,
            lots,
            accounts,
            agreements,
            payments,
            onSubmit,
            formChange,
            lotChange,
            selectedPayment,
            currentUser,
        } = this.props;

        const currentParam = this.props.params.id;

        const lotsList = [];

        if (!!lots && lots.length > 0) {
            map((lot) => {
                lotsList.push({
                    id: lot.id,
                    value: [lot.id, lot.address_full],
                    label: lot.address_full,
                });
            })(lots);
        }

        const accountsList = accounts.length > 0 &&
            (map((account) => {
                return (
                    <option key={account.id} value={[account.id, account.account_name]} >
                        {account.account_name}
                    </option>
                );
            })(accounts));

        const agreementsList = agreements.length > 0 &&
            (map((agreement) => {
                return (
                    <option key={agreement.id} value={[agreement.id, agreement.resolution_number]} >
                        Resolution: {agreement.resolution_number}
                    </option>
                );
            })(agreements));

        const currentLot = !!lots && lots.length > 0 &&
            filter(lot => lot.id === parseInt(activeForm.lot_id, 10))(lots)[0];

        const submitEnabled =
            activeForm.lot_id &&
            activeForm.credit_account &&
            activeForm.paid_by &&
            activeForm.paid_by_type;

        return (
            <div className="payment-form">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>PAYMENTS - CREATE</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'payment'} parent_name={'Payments'} />

                <div className="inside-body">
                    <div className="container">
                        {payments.loadingPayment ? <LoadingScreen /> :
                        (
                            <div className="col-sm-offset-1 col-sm-10">
                                {currentParam && !!payments.currentPayment && payments.currentPayment.is_approved === false && <div className="row"><h1 className="approval-pending">Approval Pending</h1></div>}
                                <form >
                                    <fieldset>
                                        <div className="row form-subheading">
                                            <h3>Associated Files</h3>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6 form-group">
                                                <label htmlFor="lot_id" className="form-label" id="lot_id" aria-label="Lot" aria-required="true">* Lot</label>
                                                <Typeahead
                                                  onChange={e => lotChange(e)}
                                                  id="lot_id"
                                                  options={lotsList}
                                                  placeholder="Lot"
                                                  emptyLabel={lots.lots.length > 0 ? 'No Results Found.' : 'Results loading...'}
                                                  selected={activeForm.lot_id ? (
                                                    filter(lot => lot.id === activeForm.lot_id)(lotsList)
                                                    ) : []}
                                                  aria-required="true"
                                                />
                                            </div>
                                            <div className="col-sm-6">
                                                {activeForm.lot_exactions &&
                                                    <div>
                                                        <h3 htmlFor="lot_exactions" className="text-center" aria-label="Current Exactions">Current Lot Exactions Due:</h3>
                                                        <h4 className="text-center" >{activeForm.lot_exactions}</h4>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6 form-group">
                                                <label htmlFor="credit_account" className="form-label" id="credit_account" aria-label="Developer Account" aria-required="true">* Developer Account</label>
                                                <select className="form-control" id="credit_account" onChange={formChange('credit_account')} value={activeForm.credit_account_show} >
                                                    {activeForm.credit_account_show ?
                                                        <option value="credit_account">{activeForm.credit_account_show}</option> :
                                                        <option value="start_account">Developer Account</option>
                                                    }
                                                    {accountsList}
                                                </select>
                                            </div>
                                            <div className="col-sm-6 form-group">
                                                <label htmlFor="credit_source" className="form-label" id="credit_source" aria-label="Agreement">Agreement</label>
                                                <select className="form-control" id="credit_source" onChange={formChange('credit_source')} value={activeForm.credit_source_show} >
                                                    {activeForm.credit_source_show ?
                                                        <option value="credit_source">Resolution: {activeForm.credit_source_show}</option> :
                                                        <option value="start_source">Agreement</option>
                                                    }
                                                    {agreementsList}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row form-subheading">
                                            <h3>Payment Information</h3>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <FormGroup label="* Paid By" id="paid_by" ariaRequired="true">
                                                    <input type="text" className="form-control" placeholder="Paid By" />
                                                </FormGroup>
                                            </div>
                                            <div className="col-sm-6 form-group">
                                                <label htmlFor="paid_by_type" className="form-label" id="paid_by_type" aria-label="Paid By Type" aria-required="true">* Paid By Type</label>
                                                <select className="form-control" id="paid_by_type" onChange={formChange('paid_by_type')} value={activeForm.paid_by_type_show} >
                                                    <option value="start_paid_by_type">Paid By Type</option>
                                                    <option value={['DEVELOPER', 'Developer']}>Developer</option>
                                                    <option value={['BUILDER', 'Builder']}>Builder</option>
                                                    <option value={['OWNER', 'Home Owner']}>Home Owner</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6 form-group">
                                                <label htmlFor="payment_type" className="form-label" id="payment_type" aria-label="Payment Type" aria-required="true">* Payment Type</label>
                                                <select className="form-control" id="payment_type" onChange={formChange('payment_type')} value={activeForm.payment_type_show} >
                                                    <option value="start_payment_type">Payment Type</option>
                                                    <option value={['CHECK', 'Check']}>Check</option>
                                                    <option value={['CREDIT_CARD', 'Credit Card']}>Credit Card</option>
                                                    <option value={['OTHER', 'Other']}>Other</option>
                                                </select>
                                            </div>
                                            <div className="col-sm-6">
                                                <FormGroup label="Check Number" id="check_number">
                                                    <input type="text" className="form-control" placeholder="Check Number" />
                                                </FormGroup>
                                            </div>
                                        </div>
                                        <div className="row form-subheading">
                                            <h3>Exactions Payments</h3>
                                        </div>
                                        {activeForm.sewer_exactions || activeForm.non_sewer_exactions ?
                                            <div className="white-box">
                                                {activeForm.sewer_exactions || activeForm.non_sewer_exactions ?
                                                    <div className="text-center">
                                                        <div className="row">
                                                            <h3>Exactions Due</h3>
                                                            <hr />
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-xs-6 col-sm-4 col-sm-offset-2">
                                                                <h4>Sewer: {activeForm.sewer_exactions}</h4>
                                                            </div>
                                                            <div className="col-xs-6 col-sm-4">
                                                                <h4>Non-sewer: {activeForm.non_sewer_exactions}</h4>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-xs-6 col-sm-4 col-sm-offset-2">
                                                                <h5>Roads: {activeForm.dues_roads_dev}</h5>
                                                            </div>
                                                            <div className="col-xs-6 col-sm-4">
                                                                <h5>Parks: {activeForm.dues_parks_dev}</h5>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-xs-6 col-sm-4 col-sm-offset-2">
                                                                <h5>Sewer Capacity: {activeForm.dues_sewer_cap_dev}</h5>
                                                            </div>
                                                            <div className="col-xs-6 col-sm-4">
                                                                <h5>Sewer Transmission: {activeForm.dues_sewer_trans_dev}</h5>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-xs-6 col-sm-4 col-sm-offset-2">
                                                                <h5>Storm: {activeForm.dues_storm_dev}</h5>
                                                            </div>
                                                            <div className="col-xs-6 col-sm-4">
                                                                <h5>Open Spaces: {activeForm.dues_open_space_dev}</h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                : null}
                                            </div>
                                        : null}
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <FormGroup label="Road Exactions" id="paid_roads">
                                                    <input
                                                      type="number"
                                                      step="0.01"
                                                      className="form-control"
                                                      placeholder="Road Exactions Paid"
                                                    />
                                                </FormGroup>
                                            </div>
                                            <div className="col-sm-6">
                                                <FormGroup label="Parks Exactions" id="paid_parks">
                                                    <input
                                                      type="number"
                                                      step="0.01"
                                                      className="form-control"
                                                      placeholder="Parks Exactions Paid"
                                                    />
                                                </FormGroup>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <FormGroup label="Sewer Capacity Exactions" id="paid_sewer_cap">
                                                    <input
                                                      type="number"
                                                      step="0.01"
                                                      className="form-control"
                                                      placeholder="Sewer Capacity Exactions Paid"
                                                    />
                                                </FormGroup>
                                            </div>
                                            <div className="col-sm-6">
                                                <FormGroup label="Sewer Transmission Exactions" id="paid_sewer_trans">
                                                    <input
                                                      type="number"
                                                      step="0.01"
                                                      className="form-control"
                                                      placeholder="Sewer Transmission Exactions Paid"
                                                    />
                                                </FormGroup>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <FormGroup label="Storm Exactions" id="paid_storm">
                                                    <input
                                                      type="number"
                                                      step="0.01"
                                                      className="form-control"
                                                      placeholder="Storm Exactions Paid"
                                                    />
                                                </FormGroup>
                                            </div>
                                            <div className="col-sm-6">
                                                <FormGroup label="Open Spaces Exactions" id="paid_open_space">
                                                    <input
                                                      type="number"
                                                      step="0.01"
                                                      className="form-control"
                                                      placeholder="Open Spaces Exactions Paid"
                                                    />
                                                </FormGroup>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <div className="col-xs-8">
                                        <button disabled={!submitEnabled} className="btn btn-lex" onClick={onSubmit} >
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
                                        <DeclineDelete currentForm="/payment/" selectedEntry={selectedPayment} parentRoute="payment" />
                                    </div>
                                </form>
                                <div className="clearfix" />
                                {currentLot && currentLot.id ? <div>
                                    {selectedPayment ?
                                        <Notes
                                          secondary_content_type="plats_lot"
                                          secondary_object_id={currentLot.id}
                                          content_type={'accounts_payment'}
                                          object_id={selectedPayment}
                                          ariaExpanded="true"
                                          panelClass="panel-collapse collapse row in"
                                          permission="payment"
                                        />
                                    :
                                        <Notes
                                          content_type="plats_lot"
                                          object_id={currentLot.id}
                                          ariaExpanded="true"
                                          panelClass="panel-collapse collapse row in"
                                          permission="lot"
                                        />
                                    }
                                </div>
                                : <div>
                                    {selectedPayment &&
                                        <Notes
                                          content_type="accounts_payment"
                                          object_id={selectedPayment}
                                          ariaExpanded="true"
                                          panelClass="panel-collapse collapse row in"
                                          permission="payment"
                                        />
                                    }
                                </div>}
                            </div>
                        )}
                    </div>
                </div>

                <Footer />
            </div>
        );
    }
}

PaymentForm.propTypes = {
    activeForm: PropTypes.object,
    lots: PropTypes.array,
    accounts: PropTypes.array,
    agreements: PropTypes.array,
    payments: PropTypes.array,
    route: PropTypes.object,
    params: PropTypes.object,
    onComponentDidMount: PropTypes.func,
    onSubmit: PropTypes.func,
    formChange: PropTypes.func,
    lotChange: PropTypes.func,
    selectedPayment: PropTypes.string,
    currentUser: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        activeForm: state.activeForm,
        lots: !!state.lots && !!state.lots.lots && state.lots.lots,
        accounts: !!state.accounts && !!state.accounts.accounts && state.accounts.accounts,
        agreements: !!state.agreements && !!state.agreements.agreements && state.agreements.agreements,
        payments: !!state.payments && state.payments,
        currentUser: state.currentUser,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedPayment = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(formInit());
            dispatch(formUpdate({ loading: true }));
            dispatch(getLots());
            dispatch(getAccounts());
            dispatch(getAgreements())
            .then(()=> {
                dispatch(formUpdate({ loading: false }));
            })
            if (selectedPayment) {
                dispatch(getPaymentID(selectedPayment))
                .then((data_payment) => {
                    const update = {
                        credit_account: data_payment.response && data_payment.response.credit_account ? data_payment.response.credit_account.id : null,
                        credit_account_show: data_payment.response && data_payment.response.credit_account ? `${data_payment.response.credit_account.id},${data_payment.response.credit_account.account_name}` : '',
                        credit_source: data_payment.response && data_payment.response.credit_source ? data_payment.response.credit_source.id : null,
                        credit_source_show: data_payment.response && data_payment.response.credit_source ? `${data_payment.response.credit_source.id},${data_payment.response.credit_source.resolution_number}` : '',
                        lot_id: data_payment.response && data_payment.response.lot_id ? data_payment.response.lot_id.id : null,
                        lot_id_show: data_payment.response && data_payment.response.lot_id ? `${data_payment.response.lot_id.id},${data_payment.response.lot_id.address_full}` : '',
                        paid_by: data_payment.response.paid_by,
                        paid_by_type: data_payment.response.paid_by_type,
                        paid_by_type_show: `${data_payment.response.paid_by_type},${data_payment.response.paid_by_type_display}`,
                        payment_type: data_payment.response.payment_type,
                        payment_type_show: `${data_payment.response.payment_type},${data_payment.response.payment_type_display}`,
                        check_number: data_payment.response.check_number,
                        paid_roads: data_payment.response.paid_roads,
                        paid_sewer_trans: data_payment.response.paid_sewer_trans,
                        paid_sewer_cap: data_payment.response.paid_sewer_cap,
                        paid_parks: data_payment.response.paid_parks,
                        paid_storm: data_payment.response.paid_storm,
                        paid_open_space: data_payment.response.paid_open_space,
                    };
                    dispatch(formUpdate(update));
                });
            } else {
                const initial_constants = {
                    credit_account_show: '',
                    credit_source_show: '',
                    lot_id_show: '',
                    paid_by_type_show: '',
                    payment_type_show: '',
                };
                dispatch(formUpdate(initial_constants));
            }
        },
        lotChange(selected) {
            const value = selected[0] !== undefined ? selected[0].value : 'start_lot';

            if (value !== 'start_lot') {
                const value_id = value[0];
                const value_name = value[1];

                dispatch(getLotID(value_id))
                .then((lot_id) => {
                    if (lot_id.response.account) {
                        dispatch(getAccountID(lot_id.response.account))
                        .then((account) => {
                            const update = {
                                credit_account_show: account.response.account_name,
                                credit_account: lot_id.response.account,
                                account_name: account.response.account_name,
                                lot_id: value_id,
                                address_full: value_name,
                                lot_exactions: lot_id.response.lot_exactions.total_exactions,
                                non_sewer_exactions: lot_id.response.lot_exactions.non_sewer_exactions,
                                sewer_exactions: lot_id.response.lot_exactions.sewer_exactions,
                                dues_open_space_dev: lot_id.response.current_dues_open_space_dev,
                                dues_parks_dev: lot_id.response.current_dues_parks_dev,
                                dues_roads_dev: lot_id.response.current_dues_roads_dev,
                                dues_sewer_cap_dev: lot_id.response.current_dues_sewer_cap_dev,
                                dues_sewer_trans_dev: lot_id.response.current_dues_sewer_trans_dev,
                                dues_storm_dev: lot_id.response.current_dues_storm_dev,
                            };
                            dispatch(formUpdate(update));
                            dispatch(getAccountAgreements(lot_id.response.account));
                        });
                    } else {
                        const update = {
                            lot_id: value_id,
                            address_full: value_name,
                            lot_exactions: lot_id.response.lot_exactions.total_exactions,
                            non_sewer_exactions: lot_id.response.lot_exactions.non_sewer_exactions,
                            sewer_exactions: lot_id.response.lot_exactions.sewer_exactions,
                            dues_open_space_dev: lot_id.response.current_dues_open_space_dev,
                            dues_parks_dev: lot_id.response.current_dues_parks_dev,
                            dues_roads_dev: lot_id.response.current_dues_roads_dev,
                            dues_sewer_cap_dev: lot_id.response.current_dues_sewer_cap_dev,
                            dues_sewer_trans_dev: lot_id.response.current_dues_sewer_trans_dev,
                            dues_storm_dev: lot_id.response.current_dues_storm_dev,
                        };
                        dispatch(formUpdate(update));
                    }
                    dispatch(getNoteContent('plats_lot', value_id, 'plats_plat', lot_id.response.plat.id, 'plats_subdivision', lot_id.response.plat.subdivision.id));
                });
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
        onSubmit(event) {
            event.preventDefault();
            if (selectedPayment) {
                dispatch(putPayment(selectedPayment))
                .then((data) => {
                    if (data.response) {
                        hashHistory.push(`payment/summary/${selectedPayment}`);
                    }
                });
            } else {
                dispatch(postPayment())
                .then((data_post) => {
                    if (data_post.response) {
                        hashHistory.push(`payment/summary/${data_post.response.id}`);
                    }
                });
            }
        },
        selectedPayment,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentForm);
