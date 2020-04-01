import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { map } from 'ramda';
import PropTypes from 'prop-types';
import { Typeahead } from 'react-bootstrap-typeahead';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

import FormGroup from './FormGroup';
import Notes from './Notes';
import DeclineDelete from './DeclineDelete';
import LoadingScreen from './LoadingScreen';

import {
    formInit,
    formUpdate,
} from '../actions/formActions';
import { setLoadingFalse } from '../actions/stateActions';

import {
    getPlatsQuick,
    getLotExactions,
    getAccounts,
    getAgreementsQuick,
    getAccountLedgerID,
    postAccountLedger,
    putAccountLedger,
    getLotID,
} from '../actions/apiActions';

import {
    setAccountFrom,
    setAccountTo,
} from '../actions/componentActions/accountActions';

import { setCurrentPlat } from '../actions/componentActions/platActions';
import { setCurrentLot } from '../actions/componentActions/lotActions';
import { setCurrentAgreement } from '../actions/componentActions/agreementActions';

class AccountLedgerForm extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            accountFormChange,
            accounts,
            accountLedgers,
            activeForm,
            agreements,
            agreementChange,
            closeModal,
            currentUser,
            formChange,
            lotFormChange,
            lots,
            onSubmit,
            platFormChange,
            plats,
            selectedAccountLedger,
        } = this.props;

        const platsList = !!plats.plats && (map((plat) => {
            // TODO Update with the cabinet-slide updates
            const cabinet = plat.cabinet ? `${plat.cabinet}-` : '';
            const slide = plat.slide ? plat.slide : plat.name;
            return (
                <option key={plat.id} value={plat.id} >
                    {cabinet}{slide}
                </option>
            );
        })(plats.plats));

        const lotsList = [];

        if (!!lots.lots) {
            map((lot) => {
                lotsList.push({
                    id: lot.id,
                    key: lot.id,
                    value: lot.id, 
                    label: lot.address_full,
                });
            })(lots.lots);
        }

        const defaultLot = !!lots.currentLot ? [lots.currentLot.address_full] : [];

        const accountsList = accounts && accounts.accounts.length > 0 && (map((account) => {
            return (
                <option key={account.id} value={account.id} >
                    {account.account_name}
                </option>
            );
        })(accounts.accounts));

        const agreementsList = !!agreements.agreements && (map((agreement) => {
            return (
                <option key={agreement.id} value={agreement.id} >
                    Resolution: {agreement.resolution_number} : {agreement.account_name}
                </option>
            );
        })(agreements.agreements));

        const submitEnabled =
            !!accounts.accountFrom && !!accounts.accountFrom.id &&
            !!accounts.accountTo && !!accounts.accountTo.id &&
            !!agreements.currentAgreement && !!agreements.currentAgreement.id &&
            activeForm.entry_type &&
            activeForm.non_sewer_credits &&
            activeForm.sewer_credits &&
            activeForm.roads &&
            activeForm.parks &&
            activeForm.storm &&
            activeForm.open_space &&
            activeForm.sewer_cap &&
            activeForm.sewer_trans &&
            activeForm.entry_date;

        const currentPlat = !!plats && !!plats.currentPlat && plats.currentPlat;
        const currentAccountBalance = !!accounts.accountFrom && accounts.accountFrom.current_account_balance;
        const nonSewerExactions = activeForm.plat_lot === 'plat' ? 
            !!currentPlat && currentPlat.current_non_sewer_due :
            !!lots.currentLot && !!lots.currentLot.lot_exactions && lots.currentLot.lot_exactions.non_sewer_exactions;
        const sewerExactions = activeForm.plat_lot === 'plat' ? 
            !!currentPlat && currentPlat.current_sewer_due :
            !!lots.currentLot && !!lots.currentLot.lot_exactions && lots.currentLot.lot_exactions.sewer_exactions;

        return (
            <div className="account-ledger-form">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>CREDIT TRANSFERS - CREATE</h1>
                    </div>
                </div>

                <Breadcrumbs
                    route={this.props.route}
                    parent_link={'credit-transfer'}
                    parent_name={'Credit Transfers'}
                />

                <div className="inside-body">
                    <div className="container">
                        {accountLedgers.loadingLedger || activeForm.loading ? <LoadingScreen /> :
                        (
                            <div className="col-sm-offset-1 col-sm-10">
                                <form >

                                    <fieldset>
                                        <div className="row">
                                            <div className="col-sm-6 form-group">
                                                <label htmlFor="entry_type" className="form-label" id="entry_type" aria-label="Entry Type" aria-required="true">* Entry Type</label>
                                                <select
                                                    className="form-control"
                                                    id="entry_type"
                                                    value={activeForm.entry_type_show || 'start_entry'}
                                                    onChange={formChange('entry_type')}
                                                >
                                                    <option value="start_entry">Entry Type</option>
                                                    <option value={['NEW', 'New Credits']}>New Credits</option>
                                                    <option value={['USE', 'Use Credits']}>Use Credits</option>
                                                    <option value={['TRANSFER', 'Transfer Credits']}>Transfer Credits</option>
                                                </select>
                                            </div>
                                            <div className="col-sm-6 form-group">
                                                <label htmlFor="plat_lot" className="form-label" id="plat_lot" aria-label="Apply By Plat or Lot">Apply By Plat or Lot</label>
                                                <select
                                                    className="form-control"
                                                    id="plat_lot" 
                                                    value={activeForm.plat_lot_show || 'start_entry'}
                                                    disabled={activeForm.entry_type !== 'USE'}
                                                    onChange={formChange('plat_lot')}
                                                >
                                                    <option value="start_entry">Plat or Lot Credit Level</option>
                                                    <option value={['plat', 'plat']}>Plat</option>
                                                    <option value={['lot', 'lot']}>Lot</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6 form-group">
                                                <label htmlFor="account_from" className="form-label" id="account_from" aria-label="Account From" aria-required="true">* Account From</label>
                                                <select
                                                    className="form-control"
                                                    id="account_from"
                                                    onChange={accountFormChange('account_from')} 
                                                    value={(!!accounts.accountFrom && accounts.accountFrom.id) || 'start_account_from'} 
                                                    disabled={!activeForm.entry_type || activeForm.entry_type === 'NEW'}
                                                >
                                                    <option value="start_account_from">Account From</option>
                                                    {accountsList}
                                                </select>
                                            </div>
                                            <div className="col-sm-6 form-group">
                                                <label htmlFor="account_to" className="form-label" id="account_to" aria-label="Account To" aria-required="true">* Account To</label>
                                                <select
                                                    className="form-control"
                                                    id="account_to"
                                                    onChange={accountFormChange('account_to')} 
                                                    value={(!!accounts.accountTo && accounts.accountTo.id) || 'start_account_to'} 
                                                    disabled={!activeForm.entry_type || activeForm.entry_type === 'USE'}
                                                >
                                                    <option value="start_account_to">Account To</option>
                                                    {accountsList}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6 form-group">
                                                <label htmlFor="plat" className="form-label" id="plat" aria-label="Plat" >Plat</label>
                                                <select
                                                    className="form-control"
                                                    id="plat"
                                                    onChange={platFormChange} 
                                                    value={(!!currentPlat && currentPlat.id) || 'start_plat'} 
                                                    disabled={activeForm.entry_type !== 'USE' || activeForm.plat_lot !== 'plat'}
                                                >
                                                    <option value="start_plat">Plat</option>
                                                    {platsList}
                                                </select>
                                            </div>
                                            <div className="col-sm-6 form-group">
                                                <label htmlFor="lot" className="form-label" id="lot" aria-label="Lot" >Lot</label>
                                                <Typeahead
                                                    onChange={e => lotFormChange(e)}
                                                    id="lot"
                                                    options={lotsList}
                                                    placeholder="Lot"
                                                    selected={defaultLot}
                                                    disabled={activeForm.entry_type !== 'USE' || activeForm.plat_lot !== 'lot'}
                                                    emptyLabel={!!lots.lots ? 'No Results Found.' : 'Results loading...'}
                                                    aria-required="true"
                                                />
                                            </div>
                                        </div>
                                        {activeForm.openModal && currentPlat.remaining_lots > 0 &&
                                        <div
                                            className={activeForm.openModal ? 'modal in' : 'modal'}
                                            role="alertdialog"
                                            aria-labelledby="modal-title"
                                            aria-describedby="modalDescription"
                                        >
                                            <div className="modal-dialog modal-lg" role="document">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <button
                                                            type="button"
                                                            className="close"
                                                            data-dismiss="modal"
                                                            aria-label="Plat is Missing Lots Close modal"
                                                            onClick={closeModal}
                                                            autoFocus
                                                        >
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                        <h4 className="modal-title" tabIndex="0">Plat is Missing Lots</h4>
                                                    </div>
                                                    <div className="modal-body">
                                                        <div className="container">
                                                            {currentPlat && <div role="document" tabIndex="0">
                                                                <h4 className="row modalDescription">
                                                                    The number of buildable lots is greater than the number of lots in this system.
                                                                </h4>
                                                                <div className="col-xs-12">
                                                                    Buildable lots on plat: {currentPlat.buildable_lots}
                                                                </div>
                                                                <div className="col-xs-12">
                                                                    Lots in system: {currentPlat.buildable_lots - currentPlat.remaining_lots}
                                                                </div>
                                                                <h5>The credits used will only apply to the lots within the system.</h5>
                                                            </div>}
                                                        </div>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button
                                                            className="btn btn-default"
                                                            data-dismiss="modal"
                                                            onClick={closeModal}
                                                            aria-label="Plat is Missing Lots Continue and close modal"
                                                        >
                                                            Continue
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        }
                                        <div className="row">
                                            <div className="col-sm-6 form-group">
                                                <label htmlFor="agreement" className="form-label" id="agreement" aria-label="Agreement" aria-required="true">* Agreement</label>
                                                <select
                                                    className="form-control"
                                                    id="agreement"
                                                    onChange={agreementChange()}
                                                    value={(!!agreements.currentAgreement && agreements.currentAgreement.id) || 'start_agreement'}
                                                    disabled={!activeForm.entry_type}
                                                >
                                                    <option value="start_agreement">Agreement Resolution</option>
                                                    {agreementsList}
                                                </select>
                                            </div>
                                            <div className="col-sm-6">
                                                <FormGroup label="* Entry Date" id="entry_date" ariaRequired="true">
                                                    <input type="date" className="form-control" placeholder="Date Format YYYY-MM-DD" disabled={!activeForm.entry_type} />
                                                </FormGroup>
                                            </div>
                                            {(!!currentAccountBalance || !!nonSewerExactions || !!sewerExactions) ?
                                                <div className="white-box">
                                                    {!!currentAccountBalance &&
                                                        <div className="row text-center">
                                                            <h4>Credits Available:</h4>
                                                            <h5>{currentAccountBalance}</h5>
                                                        </div>
                                                    }
                                                    {(!!nonSewerExactions || !!sewerExactions)
                                                    ?
                                                        <div className="text-center">
                                                            <div className="row">
                                                                <h4>Exactions Due</h4>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-sm-6">
                                                                    <h5>
                                                                        Non-Sewer Due: {nonSewerExactions}
                                                                    </h5>
                                                                </div>
                                                                <div className="col-sm-6">
                                                                    <h5>
                                                                        Sewer Due: {sewerExactions}
                                                                    </h5>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    : null}
                                                </div>
                                            : null}
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <FormGroup label="* Non-Sewer Credits" id="non_sewer_credits" ariaRequired="true">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Non-Sewer Credits"
                                                        disabled={!activeForm.entry_type}
                                                        step="0.01"
                                                        required
                                                    />
                                                </FormGroup>
                                            </div>
                                            <div className="col-sm-6">
                                                <FormGroup label="* Sewer Credits" id="sewer_credits" ariaRequired="true">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Sewer Credits"
                                                        disabled={!activeForm.entry_type}
                                                        step="0.01"
                                                        required
                                                    />
                                                </FormGroup>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <FormGroup label="* Roads" id="roads">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Roads"
                                                        disabled={!activeForm.entry_type}
                                                        step="0.01"
                                                        required
                                                    />
                                                </FormGroup>
                                            </div>
                                            <div className="col-sm-6">
                                                <FormGroup label="* Parks" id="parks">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Parks"
                                                        disabled={!activeForm.entry_type}
                                                        step="0.01"
                                                        required
                                                    />
                                                </FormGroup>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <FormGroup label="* Storm water" id="storm">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Storm water"
                                                        disabled={!activeForm.entry_type}
                                                        step="0.01"
                                                        required
                                                    />
                                                </FormGroup>
                                            </div>
                                            <div className="col-sm-6">
                                                <FormGroup label="* Open Space" id="open_space">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Open Space"
                                                        disabled={!activeForm.entry_type}
                                                        step="0.01"
                                                        required
                                                    />
                                                </FormGroup>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <FormGroup label="* Sewer Transmission" id="sewer_trans">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Sewer Transmission"
                                                        disabled={!activeForm.entry_type}
                                                        step="0.01"
                                                        required
                                                    />
                                                </FormGroup>
                                            </div>
                                            <div className="col-sm-6">
                                                <FormGroup label="* Sewer Capacity" id="sewer_cap">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Sewer Capacity"
                                                        disabled={!activeForm.entry_type}
                                                        step="0.01"
                                                        required
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
                                        <DeclineDelete
                                            currentForm="/ledger/"
                                            selectedEntry={selectedAccountLedger}
                                            parentRoute="credit-transfer"
                                        />
                                    </div>
                                </form>
                                <div className="clearfix" />
                                {!!lots.lots || !!plats.plats ? <div>
                                    {
                                        selectedAccountLedger ?
                                            !!lots.lots &&
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
                                            ))(lots.lots)
                                        :
                                        !!lots.lots &&
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
                                        ))(lots.lots)
                                    }
                                </div> : <div>
                                    {
                                        selectedAccountLedger && !activeForm.loading ?
                                            <Notes
                                              content_type="accounts_accountledger"
                                              object_id={selectedAccountLedger}
                                              ariaExpanded="true"
                                              panelClass="panel-collapse collapse row in"
                                              permission="accountledger"
                                            />
                                        : <div>
                                            {
                                            !!plats.plats &&
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
                                                ))(plats.plats)
                                            }
                                        </div>
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

AccountLedgerForm.propTypes = {
    activeForm: PropTypes.object,
    accounts: PropTypes.object,
    accountLedgers: PropTypes.object,
    agreementChange: PropTypes.func,
    agreements: PropTypes.object,
    lots: PropTypes.object,
    plats: PropTypes.object,
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
        accounts: state.accounts,
        accountLedgers: state.accountLedgers,
        agreements: state.agreements,
        lots: state.lots,
        plats: state.plats,
        currentUser: state.currentUser,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedAccountLedger = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(formInit());
            dispatch(formUpdate({ loading: true }));
            if (selectedAccountLedger) {
                let lotId;
                let fromId;
                let toId;
                let agreeId;

                Promise.all([
                    dispatch(getAccounts()),
                    dispatch(getAgreementsQuick()),
                    dispatch(getAccountLedgerID(selectedAccountLedger))
                    .then((data_account_ledger) => {
                        const ledResp = data_account_ledger.response;
                        if (ledResp) {
                            lotId = !!ledResp.lot ? ledResp.lot.id : null;
                            fromId = !!ledResp.account_from ? ledResp.account_from.id : null;
                            toId = !!ledResp.account_to ? ledResp.account_to.id : null;
                            agreeId = !!ledResp.agreement ? ledResp.agreement.id : null;
            
                            const update = {
                                entry_date: ledResp.entry_date,
                                entry_type: ledResp.entry_type,
                                entry_type_show: `${ledResp.entry_type},${ledResp.entry_type_display}`,
                                non_sewer_credits: ledResp.non_sewer_credits,
                                sewer_credits: ledResp.sewer_credits,
                                roads: ledResp.roads,
                                parks: ledResp.parks,
                                storm: ledResp.storm,
                                open_space: ledResp.open_space,
                                sewer_trans: ledResp.sewer_trans,
                                sewer_cap: ledResp.sewer_cap,
                                plat_lot: 'lot',
                                plat_lot_show: 'lot,lot',
                            };
                            dispatch(formUpdate(update));
                        }
                    }),
                ]).then(() => {
                    dispatch(getLotID(lotId));
                    dispatch(setCurrentLot(lotId));
                    dispatch(setAccountFrom(fromId));
                    dispatch(setAccountTo(toId));
                    dispatch(setCurrentAgreement(agreeId));
                    dispatch(formUpdate({ loading: false }));
                })
            } else {
                dispatch(getAccounts());
                dispatch(getAgreementsQuick());
                dispatch(setLoadingFalse('ledger'));
                const initial_constants = {
                    lot_show: '',
                    account_from: 'start_account_from',
                    account_to: 'start_account_to',
                    agreement_show: '',
                    entry_type_show: '',
                    loading: false,
                };
                dispatch(formUpdate(initial_constants));
            }
            dispatch(getLotExactions());
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

                if (value_id === 'NEW') {
                    dispatch(setAccountFrom('LFUCG'));
                    dispatch(setAccountTo(null));
                } else if (value_id === 'USE') {
                    dispatch(setAccountFrom(null));
                    dispatch(setAccountTo('LFUCG'));
                }

                if (field === 'plat_lot') {
                    if (value_id === 'plat') {
                        dispatch(getPlatsQuick());
                        dispatch(setCurrentLot(null));
                    } else if (value_id === 'lot') {
                        dispatch(getLotExactions());
                        dispatch(setCurrentPlat(null));
                    }
                }
            };
        },
        platFormChange() {
            return (e, ...args) => {
                const value = typeof e.target.value !== 'undefined' ? e.target.value : args[1];

                dispatch(setCurrentPlat(value));
                dispatch(formUpdate({openModal: true}));
            };
        },
        lotFormChange(selected) {
            const value = selected[0] !== undefined ? selected[0].value : null;

            dispatch(setCurrentLot(value));
        },
        accountFormChange(field) {
            return (e, ...args) => {
                const value = typeof e.target.value !== 'undefined' ? e.target.value : args[1];
                if (field === 'account_to') {
                    dispatch(setAccountTo(value));
                } else if (field === 'account_from') {
                    dispatch(setAccountFrom(value));
                }
            };
        },
        agreementChange() {
            return (e, ...args) => {
                const value = typeof e.target.value !== 'undefined' ? e.target.value : args[1];

                dispatch(setCurrentAgreement(value));
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
