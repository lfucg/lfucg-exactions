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
    getAgreements,
    getAgreementID,
    getProjectID,
    postProject,
    putProject,
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

                <Breadcrumbs route={this.props.route} parent_link={'project'} parent_name={'Projects'} />

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
                                                {projects.expansion_area ? (
                                                    <option value="expansion_area" aria-label={`Expansion Area ${projects.expansion_area}`}>{projects.expansion_area}</option>
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
                                        <div className="col-sm-6 form-group">
                                            <label htmlFor="project_category" className="form-label" id="project_category">Project Category</label>
                                            <select className="form-control" id="project_category" onChange={formChange('project_category')} >
                                                {projects.project_category ? (
                                                    <option value="project_category" aria-label={`Project Category ${projects.project_category_display}`}>{projects.project_category_display}</option>
                                                ) : (
                                                    <option value="choose_project_category" aria-label="Choose a Project Category">Choose a Project Category</option>
                                                )}
                                                <option value={['ROADS', 'Roads']}>Roads</option>
                                                <option value={['SEWER', 'Sanitary Sewer']}>Sanitary Sewer</option>
                                                <option value={['PARK', 'Park']}>Park</option>
                                                <option value={['STORM_WATER', 'Storm Water']}>Storm Water</option>
                                            </select>
                                        </div>
                                        {activeForm.project_category ? (
                                            <div className="col-sm-6 form-group">
                                                <label htmlFor="project_type" className="form-label" id="project_type">Project Type</label>
                                                {activeForm.project_category === 'ROADS' && (
                                                    <select className="form-control" id="project_type" onChange={formChange('project_type')} >
                                                        {projects.project_type ? (
                                                            <option value="project_type" aria-label={`Project Type ${projects.project_type_display}`}>{projects.project_type_display}</option>
                                                        ) : (
                                                            <option value="choose_project_type" aria-label="Choose a Project Type">Choose a Project Type</option>
                                                        )}
                                                        <option value={['BOULEVARD', 'Roads: Boulevard']}>Roads: Boulevard</option>
                                                        <option value={['PARKWAY', 'Roads: Parkway']}>Roads: Parkway</option>
                                                        <option value={['TWO_LANE_BOULEVARD', 'Roads: Two-Lane Boulevard']}>Roads: Two-Lane Boulevard</option>
                                                        <option value={['TWO_LANE_PARKWAY', 'Roads: Two-Lane Parkway']}>Roads: Two-Lane Parkway</option>
                                                    </select>
                                                )}
                                                {activeForm.project_category === 'SEWER' && (
                                                    <select className="form-control" id="project_type" onChange={formChange('project_type')} >
                                                        {projects.project_type ? (
                                                            <option value="project_type" aria-label={`Project Type ${projects.project_type_display}`}>{projects.project_type_display}</option>
                                                        ) : (
                                                            <option value="choose_project_type" aria-label="Choose a Project Type">Choose a Project Type</option>
                                                        )}
                                                        <option value={['SEWER_TRANSMISSION', 'Sewer: Sanitary Sewer Transmission']}>Sewer: Sanitary Sewer Transmission</option>
                                                    </select>
                                                )}
                                                {activeForm.project_category === 'PARK' && (
                                                    <select className="form-control" id="project_type" onChange={formChange('project_type')} >
                                                        {projects.project_type ? (
                                                            <option value="project_type" aria-label={`Project Type ${projects.project_type_display}`}>{projects.project_type_display}</option>
                                                        ) : (
                                                            <option value="choose_project_type" aria-label="Choose a Project Type">Choose a Project Type</option>
                                                        )}
                                                        <option value={['PARKS_AQUISITION', 'Parks Aquisition']}>Parks Aquisition</option>
                                                    </select>
                                                )}
                                                {activeForm.project_category === 'STORM_WATER' && (
                                                    <select className="form-control" id="project_type" onChange={formChange('project_type')} >
                                                        {projects.project_type ? (
                                                            <option value="project_type" aria-label={`Project Type ${projects.project_type_display}`}>{projects.project_type_display}</option>
                                                        ) : (
                                                            <option value="choose_project_type" aria-label="Choose a Project Type">Choose a Project Type</option>
                                                        )}
                                                        <option value={['STORMWATER', 'Storm Water']}>Storm Water</option>
                                                        <option value={['LAND_AQUISITION', 'Storm Water: Land Aquisition']}>Storm Water: Land Aquisition</option>
                                                    </select>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="col-sm-6 form-group">
                                                <label htmlFor="project_type" className="form-label" id="project_type">Project Type</label>
                                                <select className="form-control" id="project_type" onChange={formChange('project_type')} >
                                                    {projects.project_type ? (
                                                        <option value="project_type" aria-label={`Project Type ${projects.project_type_display}`}>{projects.project_type_display}</option>
                                                    ) : (
                                                        <option value="choose_project_type" aria-label="Choose a Project Type">Choose a Project Type</option>
                                                    )}
                                                    <option value={['BOULEVARD', 'Roads: Boulevard']}>Roads: Boulevard</option>
                                                    <option value={['PARKWAY', 'Roads: Parkway']}>Roads: Parkway</option>
                                                    <option value={['TWO_LANE_BOULEVARD', 'Roads: Two-Lane Boulevard']}>Roads: Two-Lane Boulevard</option>
                                                    <option value={['TWO_LANE_PARKWAY', 'Roads: Two-Lane Parkway']}>Roads: Two-Lane Parkway</option>
                                                    <option value={['SEWER_TRANSMISSION', 'Sewer: Sanitary Sewer Transmission']}>Sewer: Sanitary Sewer Transmission</option>
                                                    <option value={['STORMWATER', 'Storm Water']}>Storm Water</option>
                                                    <option value={['LAND_AQUISITION', 'Storm Water: Land Aquisition']}>Storm Water: Land Aquisition</option>
                                                    <option value={['PARKS_AQUISITION', 'Parks Aquisition']}>Parks Aquisition</option>
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6 form-group">
                                            <label htmlFor="project_status" className="form-label" id="project_status">Project Status</label>
                                            <select className="form-control" id="project_status" onChange={formChange('project_status')} >
                                                {projects.project_status ? (
                                                    <option value="project_status" aria-label={`Project Status ${projects.project_status_display}`}>{projects.project_status_display}</option>
                                                ) : (
                                                    <option value="choose_project_status" aria-label="Choose a Project Status">Choose a Project Status</option>
                                                )}
                                                <option value={['IN_PROGRESS', 'In Progress']}>In Progress</option>
                                                <option value={['COMPLETE', 'Complete']}>Complete</option>
                                            </select>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="Status Date" id="status_date" >
                                                <input type="date" className="form-control" placeholder="Status Date" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <FormGroup label="Project Description" id="project_description">
                                                <textarea type="text" className="form-control" placeholder="Project Description" rows="4" />
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
                        if (data_project.response.agreement_id) {
                            dispatch(getAgreementID(data_project.response.agreement_id))
                            .then((data_agreement) => {
                                const agreement_update = {
                                    resolution_number: data_agreement.response.resolution_number,
                                };
                                dispatch(formUpdate(agreement_update));
                            });
                        }
                        const update = {
                            expansion_area: data_project.response.expansion_area,
                            project_category: data_project.response.project_category,
                            project_type: data_project.response.project_type,
                            project_description: data_project.response.project_description,
                            project_status: data_project.response.project_status,
                            status_date: data_project.response.status_date,
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

