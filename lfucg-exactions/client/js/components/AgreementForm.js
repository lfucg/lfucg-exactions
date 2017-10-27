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
import Uploads from './Uploads';

import FormGroup from './FormGroup';

import DeclineDelete from './DeclineDelete';

import {
    formInit,
    formUpdate,
} from '../actions/formActions';

import {
    getAccounts,
    getAgreementID,
    postAgreement,
    putAgreement,
} from '../actions/apiActions';

class AgreementForm extends React.Component {
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
            selectedAgreement,
            currentUser,
        } = this.props;

        const currentParam = this.props.params.id;

        const accountsList = accounts.length > 0 &&
            (map((account) => {
                return (
                    <option key={account.id} value={[account.id, account.account_name]} >
                        {account.account_name}
                    </option>
                );
            })(accounts));

        const submitEnabled =
            activeForm.resolution_number &&
            activeForm.expansion_area &&
            activeForm.agreement_type;

        return (
            <div className="agreement-form">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>AGREEMENTS - CREATE</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'agreement'} parent_name={'Agreements'} />

                <div className="inside-body">
                    <div className="container">
                        <div className="col-sm-offset-1 col-sm-10">
                            {currentParam && agreements.is_approved === false && <div className="row"><h1 className="approval-pending">Approval Pending</h1></div>}
                            <form >

                                <fieldset>
                                    <div className="row">
                                        <div className="col-sm-6 form-group">
                                            <label htmlFor="account_id" className="form-label" id="account_id">Developer Account</label>
                                            <select className="form-control" id="account_id" onChange={formChange('account_id')} value={activeForm.account_id_show} >
                                                <option value="start_account">Developer Account</option>
                                                {accountsList}
                                            </select>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="* Resolution / Memo Number" id="resolution_number" aria-required="true">
                                                <input type="text" className="form-control" placeholder="Resolution / Memo Number" />
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
                                            <label htmlFor="expansion_area" className="form-label" id="expansion_area" aria-required="true">* Expansion Area</label>
                                            <select className="form-control" id="expansion_area" onChange={formChange('expansion_area')} value={activeForm.expansion_area_show} >
                                                <option value="start_area">Expansion Area</option>
                                                <option value={['EA-1', 'EA-1']}>EA-1</option>
                                                <option value={['EA-2A', 'EA-2A']}>EA-2A</option>
                                                <option value={['EA-2B', 'EA-2B']}>EA-2B</option>
                                                <option value={['EA-2C', 'EA-2C']}>EA-2C</option>
                                                <option value={['EA-3', 'EA-3']}>EA-3</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6 form-group">
                                            <label htmlFor="agreement_type" className="form-label" id="agreement_type" aria-label="Agreement Type" aria-required="true">* Agreement Type</label>
                                            <select className="form-control" id="agreement_type" onChange={formChange('agreement_type')} value={activeForm.agreement_type_show} >
                                                <option value="start_type">Agreement Type</option>
                                                <option value={['MEMO', 'Memo']}>Memo</option>
                                                <option value={['RESOLUTION', 'Resolution']}>Resolution</option>
                                                <option value={['OTHER', 'Other']}>Other</option>
                                            </select>
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
                                    <DeclineDelete currentForm="/agreement/" selectedEntry={selectedAgreement} parentRoute="agreement" />
                                </div>
                            </form>
                        </div>
                        <div className="clearfix" />
                        {agreements.id &&
                            <Uploads
                              file_content_type="accounts_agreement"
                              file_object_id={agreements.id}
                              ariaExpanded="true"
                              panelClass="panel-collapse collapse row in"
                              permission="agreement"
                            />
                        }
                    </div>
                </div>

                <Footer />
            </div>
        );
    }
}

AgreementForm.propTypes = {
    activeForm: PropTypes.object,
    accounts: PropTypes.array,
    agreements: PropTypes.array,
    route: PropTypes.object,
    params: PropTypes.object,
    onComponentDidMount: PropTypes.func,
    onSubmit: PropTypes.func,
    formChange: PropTypes.func,
    selectedAgreement: PropTypes.string,
    currentUser: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        activeForm: state.activeForm,
        accounts: state.accounts,
        agreements: state.agreements,
        currentUser: state.currentUser,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedAgreement = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(formInit());
            dispatch(getAccounts());
            if (selectedAgreement) {
                dispatch(getAgreementID(selectedAgreement))
                .then((data_agreement) => {
                    const update = {
                        account_id: data_agreement.response.account_id ? data_agreement.response.account_id.id : null,
                        account_id_show: data_agreement.response.account_id ? `${data_agreement.response.account_id.id},${data_agreement.response.account_id.account_name}` : '',
                        agreement_name: data_agreement.response.agreement_name,
                        date_executed: data_agreement.response.date_executed,
                        resolution_number: data_agreement.response.resolution_number,
                        expansion_area: data_agreement.response.expansion_area,
                        expansion_area_show: `${data_agreement.response.expansion_area},${data_agreement.response.expansion_area}`,
                        agreement_type: data_agreement.response.agreement_type,
                        agreement_type_show: `${data_agreement.response.agreement_type},${data_agreement.response.agreement_type_display}`,
                    };
                    dispatch(formUpdate(update));
                });
            } else {
                const initial_constants = {
                    account_id_show: '',
                    expansion_area_show: '',
                    agreement_type_show: '',
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
        selectedAgreement,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AgreementForm);
