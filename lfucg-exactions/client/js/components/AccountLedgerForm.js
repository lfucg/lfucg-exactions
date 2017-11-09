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

import FormGroup from './FormGroup';
import Notes from './Notes';
import DeclineDelete from './DeclineDelete';

import {
    formInit,
    formUpdate,
} from '../actions/formActions';

import {
    getPlats,
    getLots,
    getAccounts,
    getLFUCGAccount,
    getAgreements,
    getAccountLedgerID,
    postAccountLedger,
    putAccountLedger,
} from '../actions/apiActions';

class AccountLedgerForm extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            activeForm,
            plats,
            lots,
            accounts,
            agreements,
            accountLedgers,
            onSubmit,
            formChange,
            platFormChange,
            lotFormChange,
            accountFormChange,
            closeModal,
            selectedAccountLedger,
            currentUser,
        } = this.props;

        const platsList = plats.length > 0 && (map((plat) => {
            const cabinet = plat.cabinet ? `${plat.cabinet}-` : '';
            const slide = plat.slide ? plat.slide : plat.name;
            return (
                <option key={plat.id} value={[plat.id, plat.name, plat.plat_exactions.plat_non_sewer_due, plat.plat_exactions.plat_sewer_due]} >
                    {cabinet}{slide}
                </option>
            );
        })(plats));

        const lotsList = [];

        if (lots.length > 0) {
            map((lot) => {
                lotsList.push({
                    id: lot.id,
                    value: [lot.id, lot.address_full, lot.lot_exactions.non_sewer_due, lot.lot_exactions.sewer_due],
                    label: lot.address_full,
                });
            })(lots);
        }

        const accountsList = accounts.length > 0 && (map((account) => {
            return (
                <option key={account.id} value={[account.id, account.account_name, account.balance.balance]} >
                    {account.account_name}
                </option>
            );
        })(accounts));

        const agreementsList = agreements.length > 0 && (map((agreement) => {
            return (
                <option key={agreement.id} value={[agreement.id, agreement.resolution_number]} >
                    Resolution: {agreement.resolution_number}
                </option>
            );
        })(agreements));

        const submitEnabled =
            activeForm.account_from &&
            activeForm.account_to &&
            activeForm.agreement &&
            activeForm.entry_type &&
            activeForm.non_sewer_credits &&
            activeForm.sewer_credits &&
            activeForm.entry_date;

        const currentPlat = plats && plats.length > 0 &&
            filter(plat => plat.id === parseInt(activeForm.plat, 10))(plats)[0];

        return (
            <div className="account-ledger-form">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>CREDIT TRANSFERS - CREATE</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'credit-transfer'} parent_name={'Credit Transfers'} />

                <div className="inside-body">
                    <div className="container">
                        <div className="col-sm-offset-1 col-sm-10">
                            <form >

                                <fieldset>
                                    <div className="row">
                                        <div className="col-sm-6 form-group">
                                            <label htmlFor="entry_type" className="form-label" id="entry_type" aria-label="Entry Type">Entry Type</label>
                                            <select className="form-control" id="entry_type" onChange={formChange('entry_type')} value={activeForm.entry_type_show} >
                                                <option value="start_entry">Entry Type</option>
                                                <option value={['NEW', 'New Credits']}>New Credits</option>
                                                <option value={['USE', 'Use Credits']}>Use Credits</option>
                                                <option value={['TRANSFER', 'Transfer Credits']}>Transfer Credits</option>
                                            </select>
                                        </div>
                                        <div className="col-sm-6 form-group">
                                            <label htmlFor="plat_lot" className="form-label" id="plat_lot" aria-label="Apply By Plat or Lot">Apply By Plat or Lot</label>
                                            <select className="form-control" id="plat_lot" onChange={formChange('plat_lot')} value={activeForm.plat_lot_show} disabled={activeForm.entry_type !== 'USE'}>
                                                <option value="start_entry">Plat or Lot Credit Level</option>
                                                <option value={['plat', 'plat']}>Plat</option>
                                                <option value={['lot', 'lot']}>Lot</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6 form-group">
                                            <label htmlFor="account_from" className="form-label" id="account_from" aria-label="Account From" aria-required="true">* Account From</label>
                                            <select className="form-control" id="account_from" onChange={accountFormChange('account_from')} value={activeForm.account_from_show} disabled={!activeForm.entry_type || activeForm.entry_type === 'NEW'}>
                                                <option value="start_account_from">Account From</option>
                                                {accountsList}
                                            </select>
                                        </div>
                                        <div className="col-sm-6 form-group">
                                            <label htmlFor="account_to" className="form-label" id="account_to" aria-label="Account To" aria-required="true">* Account To</label>
                                            <select className="form-control" id="account_to" onChange={accountFormChange('account_to')} value={activeForm.account_to_show} disabled={!activeForm.entry_type || activeForm.entry_type === 'USE'}>
                                                <option value="start_account_to">Account To</option>
                                                {accountsList}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6 form-group">
                                            <label htmlFor="plat" className="form-label" id="plat" aria-label="Plat" >Plat</label>
                                            <select className="form-control" id="plat" onChange={platFormChange('plat')} value={activeForm.plat_show} disabled={activeForm.entry_type !== 'USE' || activeForm.plat_lot !== 'plat'}>
                                                <option value="start_plat">Plat</option>
                                                {platsList}
                                            </select>
                                        </div>
                                        <div className="col-sm-6 form-group">
                                            <label htmlFor="lot" className="form-label" id="lot" aria-label="Lot" >Lot</label>
                                            <Typeahead
                                              onChange={e => lotFormChange(e, 'lot')}
                                              id="lot"
                                              options={lotsList}
                                              placeholder="Lot"
                                              disabled={activeForm.entry_type !== 'USE' || activeForm.plat_lot !== 'lot'}
                                              emptyLabel={lots.length > 0 ? 'No Results Found.' : 'Results loading...'}
                                              selected={activeForm.lot ? (
                                                filter(lot => lot.id === activeForm.lot)(lotsList)
                                                ) : []}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6 form-group">
                                            <label htmlFor="agreement" className="form-label" id="agreement" aria-label="Agreement" aria-required="true">* Agreement</label>
                                            <select className="form-control" id="agreement" onChange={formChange('agreement')} value={activeForm.agreement_show} disabled={!activeForm.entry_type}>
                                                <option value="start_agreement">Agreement Resolution</option>
                                                {agreementsList}
                                            </select>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="* Entry Date" id="entry_date" aria-required="true" >
                                                <input type="date" className="form-control" placeholder="Date Format YYYY-MM-DD" disabled={!activeForm.entry_type} />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    {activeForm.balance || activeForm.sewer_exactions || activeForm.non_sewer_exactions ?
                                        <div className="white-box">
                                            {activeForm.balance &&
                                                <div className="row text-center">
                                                    <h4>Credits Available:</h4>
                                                    <h5>{activeForm.balance}</h5>
                                                </div>
                                            }
                                            {activeForm.sewer_exactions || activeForm.non_sewer_exactions ?
                                                <div className="text-center">
                                                    <div className="row">
                                                        <h4>Exactions Due</h4>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-sm-6">
                                                            <h5>Non-Sewer Due: {activeForm.non_sewer_exactions}</h5>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <h5>Sewer Due: {activeForm.sewer_exactions}</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            : null}
                                        </div>
                                    : null}
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="* Non-Sewer Credits" id="non_sewer_credits" aria-required="true" >
                                                <input
                                                  type="number"
                                                  className="form-control"
                                                  placeholder="Non-Sewer Credits"
                                                  disabled={!activeForm.entry_type}
                                                  step="0.01"
                                                />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="* Sewer Credits" id="sewer_credits" aria-required="true" >
                                                <input
                                                  type="number"
                                                  className="form-control"
                                                  placeholder="Sewer Credits"
                                                  disabled={!activeForm.entry_type}
                                                  step="0.01"
                                                />
                                            </FormGroup>
                                        </div>
                                    </div>
                                </fieldset>
                                <div className="col-xs-8">
                                    <button disabled={!submitEnabled} className="btn btn-lex" onClick={() => onSubmit(activeForm.plat_lot)} >
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
                                    <DeclineDelete currentForm="/ledger/" selectedEntry={selectedAccountLedger} parentRoute="credit-transfer" />
                                </div>
                            </form>
                            {activeForm.openModal && currentPlat.plat_exactions && (currentPlat.plat_exactions.remaining_lots > 0) &&
                            <div className={activeForm.openModal ? 'modal in' : 'modal'} tabIndex="-1" role="dialog">
                                <div className="modal-dialog modal-lg" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModal}><span aria-hidden="true">&times;</span></button>
                                            <h4 className="modal-title">Plat is Missing Lots</h4>
                                        </div>
                                        <div className="modal-body">
                                            <div className="container">
                                                {currentPlat && <div>
                                                    <h4 className="row">The number of buildable lots is greater than the number of lots in this system.</h4>
                                                    <div className="col-xs-12">
                                                        Buildable lots on plat: {currentPlat.buildable_lots}
                                                    </div>
                                                    <div className="col-xs-12">
                                                        Lots in system: {currentPlat.buildable_lots - (currentPlat.plat_exactions && currentPlat.plat_exactions.remaining_lots)}
                                                    </div>
                                                    <h5>The credits used will only apply to the lots within the system.</h5>
                                                </div>}
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-default" data-dismiss="modal" onClick={closeModal} >Continue</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            }
                            <div className="clearfix" />
                            {activeForm.lot || activeForm.plat ? <div>
                                {
                                    selectedAccountLedger ?
                                        lots && lots.length > 0 &&
                                            map((lot =>
                                                (lot.id === parseInt(activeForm.lot, 10)) ?
                                                    <Notes
                                                      secondary_content_type="plats_lot"
                                                      secondary_object_id={lot.id}
                                                      content_type={'accounts_accountledger'}
                                                      object_id={selectedAccountLedger}
                                                      ariaExpanded="true"
                                                      panelClass="panel-collapse collapse row in"
                                                      permission="accountledger"
                                                    />
                                                : null
                                        ))(lots)
                                    :
                                        lots && lots.length > 0 &&
                                            map((lot =>
                                                (lot.id === parseInt(activeForm.lot, 10)) ?
                                                    <Notes
                                                      content_type="plats_lot"
                                                      object_id={lot.id}
                                                      ariaExpanded="true"
                                                      panelClass="panel-collapse collapse row in"
                                                      permission="accountledger"
                                                    />
                                                : null
                                        ))(lots)
                                }
                                {
                                    plats && plats.length > 0 &&
                                        map((plat =>
                                            (plat.id === parseInt(activeForm.plat, 10)) ?
                                                <Notes
                                                  content_type="plats_plat"
                                                  object_id={plat.id}
                                                  ariaExpanded="true"
                                                  panelClass="panel-collapse collapse row in"
                                                  permission="plat"
                                                />
                                            : null
                                    ))(plats)
                                }
                            </div> : <div>
                                {selectedAccountLedger &&
                                    <Notes
                                      content_type="accounts_accountledger"
                                      object_id={selectedAccountLedger}
                                      ariaExpanded="true"
                                      panelClass="panel-collapse collapse row in"
                                      permission="accountledger"
                                    />
                                }
                            </div>}
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        );
    }
}

AccountLedgerForm.propTypes = {
    activeForm: PropTypes.object,
    plats: PropTypes.array,
    lots: PropTypes.array,
    accounts: PropTypes.array,
    agreements: PropTypes.array,
    accountLedgers: PropTypes.array,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
    onSubmit: PropTypes.func,
    formChange: PropTypes.func,
    platFormChange: PropTypes.func,
    lotFormChange: PropTypes.func,
    accountFormChange: PropTypes.func,
    closeModal: PropTypes.func,
    selectedAccountLedger: PropTypes.string,
    currentUser: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        activeForm: state.activeForm,
        plats: state.plats,
        lots: state.lots,
        accounts: state.accounts,
        agreements: state.agreements,
        accountLedgers: state.accountLedgers,
        currentUser: state.currentUser,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedAccountLedger = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(formInit());
            dispatch(getAccounts());
            dispatch(getAgreements());
            if (selectedAccountLedger) {
                dispatch(getLots());
                dispatch(getAccountLedgerID(selectedAccountLedger))
                .then((data_account_ledger) => {
                    const update = {
                        lot: data_account_ledger.response && data_account_ledger.response.lot ? data_account_ledger.response.lot.id : null,
                        lot_show: data_account_ledger.response && data_account_ledger.response.lot ? `${data_account_ledger.response.lot.id},${data_account_ledger.response.lot.address_full},${data_account_ledger.response.lot.lot_exactions.non_sewer_due},${data_account_ledger.response.lot.lot_exactions.sewer_due}` : '',
                        account_from: data_account_ledger.response && data_account_ledger.response.account_from ? data_account_ledger.response.account_from.id : null,
                        account_from_show: data_account_ledger.response && data_account_ledger.response.account_from ? `${data_account_ledger.response.account_from.id},${data_account_ledger.response.account_from.account_name},${data_account_ledger.response.account_from.balance.balance}` : '',
                        account_to: data_account_ledger.response && data_account_ledger.response.account_to ? data_account_ledger.response.account_to.id : null,
                        account_to_show: data_account_ledger.response && data_account_ledger.response.account_to ? `${data_account_ledger.response.account_to.id},${data_account_ledger.response.account_to.account_name},${data_account_ledger.response.account_to.balance.balance}` : '',
                        agreement: data_account_ledger.response && data_account_ledger.response.agreement ? data_account_ledger.response.agreement.id : null,
                        agreement_show: data_account_ledger.response && data_account_ledger.response.agreement ? `${data_account_ledger.response.agreement.id},${data_account_ledger.response.agreement.resolution_number}` : '',
                        entry_date: data_account_ledger.response.entry_date,
                        entry_type: data_account_ledger.response.entry_type,
                        entry_type_show: `${data_account_ledger.response.entry_type},${data_account_ledger.response.entry_type_display}`,
                        non_sewer_credits: data_account_ledger.response.non_sewer_credits,
                        sewer_credits: data_account_ledger.response.sewer_credits,
                        plat_lot: 'lot',
                        plat_lot_show: 'lot,lot',
                    };
                    dispatch(formUpdate(update));
                });
            } else {
                const initial_constants = {
                    lot_show: '',
                    account_from_show: '',
                    account_to_show: '',
                    agreement_show: '',
                    entry_type_show: '',
                };
                dispatch(formUpdate(initial_constants));
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

                if (field === 'entry_type') {
                    dispatch(getLFUCGAccount())
                    .then((data_lfucg) => {
                        if (value_id === 'NEW') {
                            const lfucg_from_update = {
                                account_from: data_lfucg.response[0].id,
                                account_from_show: `${data_lfucg.response[0].id},${data_lfucg.response[0].account_name},${data_lfucg.response[0].balance.balance}`,
                                account_to_show: '',
                            };
                            dispatch(formUpdate(lfucg_from_update));
                        } else if (value_id === 'USE') {
                            const lfucg_to_update = {
                                account_to: data_lfucg.response[0].id,
                                account_to_show: `${data_lfucg.response[0].id},${data_lfucg.response[0].account_name},${data_lfucg.response[0].balance.balance}`,
                                account_from_show: '',
                            };
                            dispatch(formUpdate(lfucg_to_update));
                        } else if (value_id === 'TRANSFER') {
                            const lfucg_to_update = {
                                account_from_show: '',
                                account_to_show: '',
                            };
                            dispatch(formUpdate(lfucg_to_update));
                        }
                    });
                }

                if (field === 'plat_lot') {
                    if (value_id === 'plat') {
                        dispatch(getPlats());
                        const remove_lot = {
                            lot: '',
                            lot_show: '',
                            lot_name: '',
                        };
                        dispatch(formUpdate(remove_lot));
                    } else if (value_id === 'lot') {
                        dispatch(getLots());
                        const remove_plat = {
                            plat: '',
                            plat_show: '',
                            plat_name: '',
                        };
                        dispatch(formUpdate(remove_plat));
                    }
                }
            };
        },
        platFormChange(field) {
            return (e, ...args) => {
                const value = typeof e.target.value !== 'undefined' ? e.target.value : args[1];

                const comma_index = value.indexOf(',');
                const dollar_index = value.indexOf('$');
                const second_dollar_index = value.indexOf(',$', dollar_index + 1);

                if (comma_index !== -1 && dollar_index !== -1 && second_dollar_index !== -1) {
                    const value_id = value.substring(0, comma_index);
                    const value_name = value.substring(comma_index + 1, dollar_index);
                    const value_non_sewer = value.substring(dollar_index, second_dollar_index);
                    const value_sewer = value.substring(second_dollar_index + 1, value.length);

                    const field_name = `${[field]}_name`;
                    const field_show = `${[field]}_show`;

                    const plat_update = {
                        [field]: value_id,
                        [field_name]: value_name,
                        [field_show]: value,
                        non_sewer_exactions: value_non_sewer,
                        sewer_exactions: value_sewer,
                        openModal: true,
                    };

                    dispatch(formUpdate(plat_update));
                }
            };
        },
        lotFormChange(selected, field) {
            const value = selected[0] !== undefined ? selected[0].value : 'start_lot';

            if (value !== 'start_lot') {
                const value_id = value[0];
                const value_name = value[1];
                const value_non_sewer = value[2];
                const value_sewer = value[3];

                const field_name = `${[field]}_name`;
                const field_show = `${[field]}_show`;

                const lot_update = {
                    [field]: value_id,
                    [field_name]: value_name,
                    [field_show]: value,
                    non_sewer_exactions: value_non_sewer,
                    sewer_exactions: value_sewer,
                };

                dispatch(formUpdate(lot_update));
            }
        },
        accountFormChange(field) {
            return (e, ...args) => {
                const value = typeof e.target.value !== 'undefined' ? e.target.value : args[1];

                const comma_index = value.indexOf(',');
                const dollar_index = value.indexOf('$');

                if (comma_index !== -1 && dollar_index !== -1) {
                    const value_id = value.substring(0, comma_index);
                    const value_name = value.substring(comma_index + 1, dollar_index);
                    const value_balance = value.substring(dollar_index, value.length);

                    const field_name = `${[field]}_name`;
                    const field_show = `${[field]}_show`;

                    const account_update = {
                        [field]: value_id,
                        [field_name]: value_name,
                        [field_show]: value,
                    };
                    dispatch(formUpdate(account_update));
                    if (field === 'account_from' && (value_name.indexOf('LFUCG') === -1)) {
                        const balance_update = {
                            balance: value_balance,
                        };
                        dispatch(formUpdate(balance_update));
                    }
                }
            };
        },
        onSubmit(event) {
            if (selectedAccountLedger) {
                dispatch(putAccountLedger(selectedAccountLedger))
                .then((data) => {
                    if (data.response) {
                        hashHistory.push(`credit-transfer/summary/${selectedAccountLedger}`);
                    }
                });
            } else {
                dispatch(postAccountLedger())
                .then((data_post) => {
                    if (data_post.response && data_post.response.id) {
                        if (event === 'plat') {
                            hashHistory.push('credit-transfer');
                        } else {
                            hashHistory.push(`credit-transfer/summary/${data_post.response.id}`);
                        }
                    }
                });
            }
        },
        closeModal() {
            dispatch(formUpdate({ openModal: false }));
        },
        selectedAccountLedger,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountLedgerForm);
