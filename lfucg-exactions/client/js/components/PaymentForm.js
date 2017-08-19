import React from 'react';
import { connect } from 'react-redux';
import {
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
    getMe,
    getLots,
    getLotID,
    getAccounts,
    getAccountID,
    getAccountAgreements,
    getAgreements,
    getAgreementID,
    getPaymentID,
    postPayment,
    putPayment,
} from '../actions/apiActions';

class PaymentForm extends React.Component {
    static propTypes = {
        activeForm: React.PropTypes.object,
        lots: React.PropTypes.object,
        accounts: React.PropTypes.object,
        agreements: React.PropTypes.object,
        payments: React.PropTypes.object,
        route: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
        onSubmit: React.PropTypes.func,
        formChange: React.PropTypes.func,
        lotChange: React.PropTypes.func,
    };

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

        const lotsList = lots.length > 0 ? (map((lot) => {
            return (
                <option key={lot.id} value={[lot.id, lot.address_full]} >
                    {lot.address_full}
                </option>
            );
        })(lots)) : null;

        const accountsList = accounts.length > 0 ? (map((account) => {
            return (
                <option key={account.id} value={[account.id, account.account_name]} >
                    {account.account_name}
                </option>
            );
        })(accounts)) : null;

        const agreementsList = agreements.length > 0 ? (map((agreement) => {
            return (
                <option key={agreement.id} value={[agreement.id, agreement.resolution_number]} >
                    {agreement.resolution_number}
                </option>
            );
        })(agreements)) : null;

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
                                            <label htmlFor="lot_id" className="form-label" id="lot_id">Lot</label>
                                            <select className="form-control" id="lot_id" onChange={lotChange('lot_id')} >
                                                {activeForm.address_full ? (
                                                    <option value="choose_source" aria-label="Selected Lot">
                                                        {activeForm.address_full}
                                                    </option>
                                                ) : (
                                                    <option value="choose_source" aria-label="Select an Lot">
                                                        Select a Lot
                                                    </option>
                                                )}
                                                {lotsList}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6 form-group">
                                            <label htmlFor="credit_account" className="form-label" id="credit_account">Account</label>
                                            <select className="form-control" id="credit_account" onChange={formChange('credit_account')} >
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
                                        <div className="col-sm-6 form-group">
                                            <label htmlFor="credit_source" className="form-label" id="credit_source">Agreement</label>
                                            <select className="form-control" id="credit_source" onChange={formChange('credit_source')} >
                                                {activeForm.resolution_number ? (
                                                    <option value="choose_source" aria-label="Selected Agreement">
                                                        {activeForm.resolution_number}
                                                    </option>
                                                ) : (
                                                    <option value="choose_source" aria-label="Select an Agreement">
                                                        Select an Agreement
                                                    </option>
                                                )}
                                                {agreementsList}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row form-subheading">
                                        <h3>Payment Information</h3>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="Paid By" id="paid_by">
                                                <input type="text" className="form-control" placeholder="Paid By" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="Paid By Type" id="paid_by_type">
                                                <input type="text" className="form-control" placeholder="Paid By Type" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="Payment Type" id="payment_type">
                                                <input type="text" className="form-control" placeholder="Payment Type" />
                                            </FormGroup>
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
                                <button className="btn btn-lex">Submit</button>
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
            dispatch(getMe())
            .then((data_me) => {
                if (data_me.error) {
                    hashHistory.push('login/');
                }
                if (selectedPayment) {
                    dispatch(getPaymentID(selectedPayment))
                    .then((data_payment) => {
                        if (data_payment.response.credit_account) {
                            dispatch(getAccountID(data_payment.response.credit_account))
                            .then((data_account) => {
                                const account_update = {
                                    account_name: data_account.response.account_name,
                                };
                                dispatch(formUpdate(account_update));
                            });
                        }
                        if (data_payment.response.credit_source) {
                            dispatch(getAgreementID(data_payment.response.credit_source))
                            .then((data_agreement) => {
                                const agreement_update = {
                                    resolution_number: data_agreement.response.resolution_number,
                                };
                                dispatch(formUpdate(agreement_update));
                            });
                        }
                        if (data_payment.response.lot_id) {
                            dispatch(getLotID(data_payment.response.lot_id))
                            .then((data_lot) => {
                                const lot_update = {
                                    address_full: data_lot.response.address_full,
                                };
                                dispatch(formUpdate(lot_update));
                            });
                        }
                        const update = {
                            paid_by: data_payment.response.paid_by,
                            paid_by_type: data_payment.response.paid_by_type,
                            payment_type: data_payment.response.payment_type,
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
                }
            });
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
                            console.log('ACCOUNT NUMBER', lot_id.response.account);
                            const update = {
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

                const update = {
                    [field]: value_id,
                    [field_name]: value_name,
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
