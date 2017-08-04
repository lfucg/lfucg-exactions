import React from 'react';
import { connect } from 'react-redux';
import { map } from 'ramda';
import {
    hashHistory,
} from 'react-router';

import Navbar from './Navbar';
import Footer from './Footer';

import FormGroup from './FormGroup';
import Breadcrumbs from './Breadcrumbs';

import {
    formInit,
    formUpdate,
} from '../actions/formActions';

import {
    getMe,
    getProjectID,
    postProject,
    putProject,
    getAgreements,
} from '../actions/apiActions';

class ProjectForm extends React.Component {
    static propTypes = {
        activeForm: React.PropTypes.object,
        projects: React.PropTypes.object,
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
            projects,
            agreements,
            onSubmit,
            formChange,
        } = this.props;

        const agreementsList = agreements.length > 0 ? (map((agreement) => {
            return (
                <option key={agreement.id} value={[agreement.id, agreement.resolution_number]} >
                    {agreement.resolution_number}
                </option>
            );
        })(agreements)) : null;

        return (
            <div className="project-form">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>PROJECT - CREATE</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'project/existing'} parent_name={'Projects'} />

                <div className="inside-body">
                    <div className="container">
                        <div className="col-sm-offset-1 col-sm-10">
                            <form onSubmit={onSubmit} >

                                <fieldset>
                                    <div className="row">
                                        <div className="col-sm-6 form-group">
                                            <label htmlFor="agreement_id" className="form-label" id="agreement_id">Agreement</label>
                                            <select className="form-control" id="agreement_id" onChange={formChange('agreement_id')} >
                                                {activeForm.resolution_number ? (
                                                    <option value="choose_agreement" aria-label="Selected Agreement">
                                                        {activeForm.resolution_number}
                                                    </option>
                                                ) : (
                                                    <option value="choose_agreement" aria-label="Select an Agreement">
                                                        Select an Agreement
                                                    </option>
                                                )}
                                                {agreementsList}
                                            </select>
                                        </div>
                                        <div className="col-sm-6 form-group">
                                            <label htmlFor="expansion_area" className="form-label" id="expansion_area">Expansion Area</label>
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
                                            <FormGroup label="Project Category" id="project_category">
                                                <input type="text" className="form-control" placeholder="Project Category" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="Project Type" id="project_type">
                                                <input type="text" className="form-control" placeholder="Project Type" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="Project Status" id="project_status">
                                                <input type="text" className="form-control" placeholder="Project Status" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="Status Date" id="status_date" >
                                                <input type="date" className="form-control" placeholder="Status Date" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="Project Cost Estimates" id="project_cost_estimates">
                                                <input type="text" className="form-control" placeholder="Project Cost Estimates" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <FormGroup label="Project Description" id="project_description">
                                            <textarea type="text" className="form-control" placeholder="Project Description" rows="4" />
                                        </FormGroup>
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
        projects: state.projects,
        agreements: state.agreements,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedProject = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(formInit());
            dispatch(getAgreements());
            dispatch(getMe())
            .then((data_me) => {
                if (data_me.error) {
                    hashHistory.push('login/');
                }
                if (selectedProject) {
                    dispatch(getProjectID(selectedProject))
                    .then((data_project) => {
                        const update = {
                            resolution_number: data_project.response.agreement_id,
                            expansion_area: data_project.response.expansion_area,
                            project_category: data_project.response.project_category,
                            project_type: data_project.response.project_type,
                            project_description: data_project.response.project_description,
                            project_status: data_project.response.project_status,
                            status_date: data_project.response.status_date,
                            project_cost_estimates: data_project.response.project_cost_estimates,
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
            if (selectedProject) {
                dispatch(putProject(selectedProject))
                .then(() => {
                    hashHistory.push(`project/summary/${selectedProject}`);
                });
            } else {
                dispatch(postProject())
                .then((data_post) => {
                    hashHistory.push(`project/summary/${data_post.response.id}`);
                });
            }
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectForm);

