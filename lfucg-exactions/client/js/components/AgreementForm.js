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
    getAccounts,
    getAccountID,
    getAgreementID,
    postAgreement,
    putAgreement,
} from '../actions/apiActions';

class AgreementForm extends React.Component {
    static propTypes = {
        activeForm: React.PropTypes.object,
        accounts: React.PropTypes.object,
        agreements: React.PropTypes.object,
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
            accounts,
            agreements,
            onSubmit,
            formChange,
        } = this.props;

        const accountsList = accounts.length > 0 ? (map((account) => {
            return (
                <option key={account.id} value={[account.id, account.account_name]} >
                    {account.account_name}
                </option>
            );
        })(accounts)) : null;

        return (
            <div className="agreement-form">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>AGREEMENTS - CREATE</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'agreement/existing'} parent_name={'Agreements'} />

                <div className="inside-body">
                    <div className="container">
                        <div className="col-sm-offset-1 col-sm-10">
                            <form onSubmit={onSubmit} >

                                <fieldset>
                                    <div className="row">
                                        <div className="col-sm-6 form-group">
                                            <label htmlFor="account_id" className="form-label" id="account_id">Account</label>
                                            <select className="form-control" id="account_id" onChange={formChange('account_id')} >
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
                                        <div className="col-sm-6">
                                            <FormGroup label="Resolution Number" id="resolution_number">
                                                <input type="text" className="form-control" placeholder="Resolution Number" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="Date Executed" id="date_executed">
                                                <input type="date" className="form-control" placeholder="Date Executed" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6 form-group">
                                            <label htmlFor="expansion_area" className="form-label" id="expansion_area">* Expansion Area</label>
                                            <select className="form-control" id="expansion_area" onChange={formChange('expansion_area')} >
                                                {agreements.expansion_area ? (
                                                    <option value="expansion_area" aria-label={`Expansion Area ${agreements.expansion_area}`}>{agreements.expansion_area}</option>
                                                ) : (
                                                    <option value="choose_expansion_area" aria-label="Choose an Expansion Area">Choose an Expansion Area</option>
                                                )}
                                                <option value={['EA-1', 'EA-1']}>EA-1</option>
                                                <option value={['EA-2A', 'EA-2A']}>EA-2A</option>
                                                <option value={['EA-2B', 'EA-2B']}>EA-2B</option>
                                                <option value={['EA-2C', 'EA-2C']}>EA-2C</option>
                                                <option value={['EA-3', 'EA-3']}>EA-3</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="Agreement Type" id="agreement_type">
                                                <input type="text" className="form-control" placeholder="Agreement Type" />
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
        accounts: state.accounts,
        agreements: state.agreements,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedAgreement = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(formInit());
            dispatch(getAccounts());
            dispatch(getMe())
            .then((data_me) => {
                if (data_me.error) {
                    hashHistory.push('login/');
                }
                if (selectedAgreement) {
                    dispatch(getAgreementID(selectedAgreement))
                    .then((data_agreement) => {
                        if (data_agreement.response.account_id) {
                            dispatch(getAccountID(data_agreement.response.account_id))
                            .then((data_account) => {
                                const account_update = {
                                    account_name: data_account.response.account_name,
                                };
                                dispatch(formUpdate(account_update));
                            });
                        }
                        const update = {
                            agreement_name: data_agreement.response.agreement_name,
                            date_executed: data_agreement.response.date_executed,
                            resolution_number: data_agreement.response.resolution_number,
                            expansion_area: data_agreement.response.expansion_area,
                            agreement_type: data_agreement.response.agreement_type,
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
            if (selectedAgreement) {
                dispatch(putAgreement(selectedAgreement))
                .then(() => {
                    hashHistory.push(`agreement/summary/${selectedAgreement}`);
                });
            } else {
                dispatch(postAgreement())
                .then((data_post) => {
                    hashHistory.push(`agreement/summary/${data_post.response.id}`);
                });
            }
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AgreementForm);
