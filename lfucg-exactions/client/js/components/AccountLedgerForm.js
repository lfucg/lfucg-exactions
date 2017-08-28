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
    getAgreements,
    getAgreementID,
    getAccountLedgerID,
    postAccountLedger,
    putAccountLedger,
} from '../actions/apiActions';

class AccountLedgerForm extends React.Component {
    static propTypes = {
        activeForm: React.PropTypes.object,
        lots: React.PropTypes.object,
        accounts: React.PropTypes.object,
        agreements: React.PropTypes.object,
        accountLedgers: React.PropTypes.object,
        route: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
        onSubmit: React.PropTypes.func,
        formChange: React.PropTypes.func,
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
            accountLedgers,
            onSubmit,
            formChange,
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

        const submitEnabled =
            activeForm.account_from &&
            activeForm.account_to &&
            activeForm.lot &&
            activeForm.agreement &&
            activeForm.entry_type &&
            activeForm.non_sewer_credits &&
            activeForm.sewer_credits &&
            activeForm.entry_date;

        return (
            <div className="account-ledger-form">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>ACCOUNT LEDGERS - CREATE</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'account-ledger'} parent_name={'Account Ledgers'} />

                <div className="inside-body">
                    <div className="container">
                        <div className="col-sm-offset-1 col-sm-10">
                            <form onSubmit={onSubmit} >

                                <fieldset>
                                    <div className="row">
                                        <div className="col-sm-6 form-group">
                                            <label htmlFor="lot" className="form-label" id="lot" aria-label="Lot" aria-required="true">* Lot</label>
                                            <select className="form-control" id="lot" onChange={formChange('lot')} >
                                                {accountLedgers.lot ? (
                                                    <option value="choose_source" aria-label="Selected Lot">
                                                        {accountLedgers.lot.address_full}
                                                    </option>
                                                ) : (
                                                    <option value="choose_source" aria-label="Select an Lot">
                                                        Select a Lot
                                                    </option>
                                                )}
                                                {lotsList}
                                            </select>
                                        </div>
                                        <div className="col-sm-6 form-group">
                                            <label htmlFor="agreement" className="form-label" id="agreement" aria-label="Agreement" aria-required="true">* Agreement</label>
                                            <select className="form-control" id="agreement" onChange={formChange('agreement')} >
                                                {accountLedgers.agreement ? (
                                                    <option value="choose_source" aria-label="Selected Agreement">
                                                        {accountLedgers.agreement.resolution_number}
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
                                    <div className="row">
                                        <div className="col-sm-6 form-group">
                                            <label htmlFor="account_from" className="form-label" id="account_from" aria-label="Account From" aria-required="true">* Account From</label>
                                            <select className="form-control" id="account_from" onChange={formChange('account_from')} >
                                                {accountLedgers.account_from ? (
                                                    <option value="choose_account" aria-label="Selected Account From">
                                                        {accountLedgers.account_from.account_name}
                                                    </option>
                                                ) : (
                                                    <option value="choose_account" aria-label="Select an Account From">
                                                        Select an Account From
                                                    </option>
                                                )}
                                                {accountsList}
                                            </select>
                                        </div>
                                        <div className="col-sm-6 form-group">
                                            <label htmlFor="account_to" className="form-label" id="account_to" aria-label="Account To" aria-required="true">* Account To</label>
                                            <select className="form-control" id="account_to" onChange={formChange('account_to')} >
                                                {accountLedgers.account_to ? (
                                                    <option value="choose_account" aria-label="Selected Account To">
                                                        {accountLedgers.account_to.account_name}
                                                    </option>
                                                ) : (
                                                    <option value="choose_account" aria-label="Select an Account To">
                                                        Select an Account To
                                                    </option>
                                                )}
                                                {accountsList}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="* Entry Date" id="entry_date" aria-required="true">
                                                <input type="date" className="form-control" placeholder="Entry Date" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="* Entry Type" id="entry_type" aria-required="true">
                                                <input type="text" className="form-control" placeholder="Entry Type" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="* Non-Sewer Credits" id="non_sewer_credits" aria-required="true">
                                                <input type="number" className="form-control" placeholder="Non-Sewer Credits" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="* Sewer Credits" id="sewer_credits" aria-required="true">
                                                <input type="number" className="form-control" placeholder="Sewer Credits" />
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
        accounts: state.accounts,
        agreements: state.agreements,
        accountLedgers: state.accountLedgers,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedAccountLedger = params.params.id;

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
                if (selectedAccountLedger) {
                    dispatch(getAccountLedgerID(selectedAccountLedger))
                    .then((data_account_ledger) => {
                        if (data_account_ledger.response.account_to) {
                            dispatch(getAccountID(data_account_ledger.response.account_to))
                            .then((data_account_to) => {
                                const account_to_update = {
                                    account_to_name: data_account_to.response.account_name,
                                };
                                dispatch(formUpdate(account_to_update));
                            });
                        }
                        if (data_account_ledger.response.account_from) {
                            dispatch(getAccountID(data_account_ledger.response.account_from))
                            .then((data_account_from) => {
                                const account_from_update = {
                                    account_from_name: data_account_from.response.account_name,
                                };
                                dispatch(formUpdate(account_from_update));
                            });
                        }
                        if (data_account_ledger.response.agreement_id) {
                            dispatch(getAgreementID(data_account_ledger.response.agreement_id))
                            .then((data_agreement) => {
                                const agreement_update = {
                                    resolution_number: data_agreement.response.resolution_number,
                                };
                                dispatch(formUpdate(agreement_update));
                            });
                        }
                        if (data_account_ledger.response.lot_id) {
                            dispatch(getLotID(data_account_ledger.response.lot_id))
                            .then((data_lot) => {
                                const lot_update = {
                                    address_full: data_lot.response.address_full,
                                };
                                dispatch(formUpdate(lot_update));
                            });
                        }
                        const update = {
                            entry_date: data_account_ledger.response.entry_date,
                            entry_type: data_account_ledger.response.paid_by_type,
                            non_sewer_credits: data_account_ledger.response.non_sewer_credits,
                            sewer_credits: data_account_ledger.response.sewer_credits,
                        };
                        dispatch(formUpdate(update));
                    });
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
        onSubmit(event) {
            event.preventDefault();
            if (selectedAccountLedger) {
                dispatch(putAccountLedger(selectedAccountLedger))
                .then(() => {
                    hashHistory.push(`account-ledger/summary/${selectedAccountLedger}`);
                });
            } else {
                dispatch(postAccountLedger())
                .then((data_post) => {
                    hashHistory.push(`account-ledger/summary/${data_post.response.id}`);
                });
            }
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountLedgerForm);
