import React from 'react';
import { connect } from 'react-redux';
import {
    hashHistory,
} from 'react-router';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

import FormGroup from './FormGroup';

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
        } = this.props;

        const lotsList = lots && lots.length > 0 &&
            (map((lot) => {
                return (
                    <option key={lot.id} value={[lot.id, lot.address_full]} >
                        {lot.address_full}
                    </option>
                );
            })(lots));

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
                        <div className="col-sm-offset-1 col-sm-10">
                            <form onSubmit={onSubmit} >

                                <fieldset>
                                    <div className="row form-subheading">
                                        <h3>Associated Files</h3>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6 form-group">
                                            <label htmlFor="lot_id" className="form-label" id="lot_id" aria-label="Lot" aria-required="true">* Lot</label>
                                            <select className="form-control" id="lot_id" onChange={lotChange('lot_id')} value={activeForm.lot_id_show} >
                                                {activeForm.lot_id ?
                                                    <option value="lot_id">{activeForm.address_full}</option> :
                                                    <option value="start_lot">Lot</option>
                                                }
                                                {lotsList}
                                            </select>
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
                                            <FormGroup label="* Paid By" id="paid_by" aria-required="true">
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
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="Road Exactions Paid" id="paid_roads">
                                                <input type="number" className="form-control" placeholder="Road Exactions Paid" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="Parks Exactions Paid" id="paid_parks">
                                                <input type="number" className="form-control" placeholder="Parks Exactions Paid" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="Sewer Capacity Exactions Paid" id="paid_sewer_cap">
                                                <input type="number" className="form-control" placeholder="Sewer Capacity Exactions Paid" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="Sewer Transmission Exactions Paid" id="paid_sewer_trans">
                                                <input type="number" className="form-control" placeholder="Sewer Transmission Exactions Paid" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="Storm Exactions Paid" id="paid_storm">
                                                <input type="number" className="form-control" placeholder="Storm Exactions Paid" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="Open Spaces Exactions Paid" id="paid_open_space">
                                                <input type="number" className="form-control" placeholder="Open Spaces Exactions Paid" />
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

PaymentForm.propTypes = {
    activeForm: PropTypes.object,
    lots: PropTypes.object,
    accounts: PropTypes.object,
    agreements: PropTypes.object,
    payments: PropTypes.object,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
    onSubmit: PropTypes.func,
    formChange: PropTypes.func,
    lotChange: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        activeForm: state.activeForm,
        lots: state.lots,
        accounts: state.accounts,
        agreements: state.agreements,
        payments: state.payments,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedPayment = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(formInit());
            dispatch(getLots());
            dispatch(getAccounts());
            dispatch(getAgreements());
            if (selectedPayment) {
                dispatch(getPaymentID(selectedPayment))
                .then((data_payment) => {
                    const update = {
                        credit_account: data_payment.response.credit_account ? data_payment.response.credit_account.id : null,
                        credit_account_show: data_payment.response.credit_account ? `${data_payment.response.credit_account.id},${data_payment.response.credit_account.account_name}` : '',
                        credit_source: data_payment.response.credit_source ? data_payment.response.credit_source.id : null,
                        credit_source_show: data_payment.response.credit_source ? `${data_payment.response.credit_source.id},${data_payment.response.credit_source.resolution_number}` : '',
                        lot_id: data_payment.response.lot_id ? data_payment.response.lot_id.id : null,
                        lot_id_show: data_payment.response.lot_id ? `${data_payment.response.lot_id.id},${data_payment.response.lot_id.address_full}` : '',
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
        lotChange() {
            return (e, ...args) => {
                const value = typeof e.target.value !== 'undefined' ? e.target.value : args[1];

                const comma_index = value.indexOf(',');
                const value_id = value.substring(0, comma_index);
                const value_name = value.substring(comma_index + 1, value.length);

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
                            };
                            dispatch(formUpdate(update));
                            dispatch(getAccountAgreements(lot_id.response.account));
                        });
                    } else {
                        const update = {
                            lot_id: value_id,
                            address_full: value_name,
                        };
                        dispatch(formUpdate(update));
                    }
                });
            };
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
                .then(() => {
                    hashHistory.push(`payment/summary/${selectedPayment}`);
                });
            } else {
                dispatch(postPayment())
                .then((data_post) => {
                    hashHistory.push(`payment/summary/${data_post.response.id}`);
                });
            }
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentForm);
