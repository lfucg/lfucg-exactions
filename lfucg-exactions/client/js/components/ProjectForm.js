import React from 'react';
import { connect } from 'react-redux';
import { map } from 'ramda';
import {
    hashHistory,
} from 'react-router';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import FormGroup from './FormGroup';
import Breadcrumbs from './Breadcrumbs';
import Uploads from './Uploads';

import DeclineDelete from './DeclineDelete';

import {
    formInit,
    formUpdate,
} from '../actions/formActions';

import {
    getAgreements,
    getProjectID,
    postProject,
    putProject,
} from '../actions/apiActions';

class ProjectForm extends React.Component {
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
            selectedProject,
            currentUser,
        } = this.props;

        const currentParam = this.props.params.id;

        const agreementsList = agreements.length > 0 ? (map((agreement) => {
            return (
                <option key={agreement.id} value={[agreement.id, agreement.resolution_number]} >
                    {agreement.resolution_number}
                </option>
            );
        })(agreements)) : null;

        const submitEnabled =
            activeForm.agreement_id &&
            activeForm.expansion_area &&
            activeForm.project_category &&
            activeForm.project_type &&
            activeForm.project_status &&
            activeForm.status_date;

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
                            {currentParam && projects.is_approved === false && <div className="row"><h1 className="approval-pending">Approval Pending</h1></div>}
                            <form >

                                <fieldset>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="* Project Name" id="name" >
                                                <input type="text" className="form-control" placeholder="Name" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6 form-group">
                                            <label htmlFor="agreement_id" className="form-label" id="agreement_id" aria-label="Agreement" aria-required="true">* Agreement</label>
                                            <select className="form-control" id="agreement_id" onChange={formChange('agreement_id')} value={activeForm.agreement_id_show} >
                                                <option value="start_agreement">Agreement</option>
                                                {agreementsList}
                                            </select>
                                        </div>
                                        <div className="col-sm-6 form-group">
                                            <label htmlFor="expansion_area" className="form-label" id="expansion_area" aria-label="Expansion Area" aria-required="true">* Expansion Area</label>
                                            <select className="form-control" id="expansion_area" onChange={formChange('expansion_area')} value={activeForm.expansion_area_show} >
                                                <option value="start_expansion">Expansion Area</option>
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
                                            <label htmlFor="project_category" className="form-label" id="project_category" aria-label="Project Category" aria-required="true">* Project Category</label>
                                            <select className="form-control" id="project_category" onChange={formChange('project_category')} value={activeForm.project_category_show} >
                                                <option value="start_category">Category</option>
                                                <option value={['ROADS', 'Roads']}>Roads</option>
                                                <option value={['SEWER', 'Sanitary Sewer']}>Sanitary Sewer</option>
                                                <option value={['PARK', 'Park']}>Park</option>
                                                <option value={['STORM_WATER', 'Storm Water']}>Storm Water</option>
                                            </select>
                                        </div>
                                        {activeForm.project_category ? (
                                            <div className="col-sm-6 form-group">
                                                <label htmlFor="project_type" className="form-label" id="project_type" aria-label="Project Type" aria-required="true">* Project Type</label>
                                                {activeForm.project_category === 'ROADS' && (
                                                    <select className="form-control" id="project_type" onChange={formChange('project_type')} value={activeForm.project_type_show} >
                                                        <option value="start_type">Project Type</option>
                                                        <option value={['BOULEVARD', 'Boulevard']}>Boulevard</option>
                                                        <option value={['PARKWAY', 'Parkway']}>Parkway</option>
                                                        <option value={['TWO_LANE_BOULEVARD', 'Two-Lane Boulevard']}>Two-Lane Boulevard</option>
                                                        <option value={['TWO_LANE_PARKWAY', 'Two-Lane Parkway']}>Two-Lane Parkway</option>
                                                        <option value={['OTHER_NON_SEWER', 'Other Non-Sewer']} >Other Non-Sewer</option>
                                                    </select>
                                                )}
                                                {activeForm.project_category === 'SEWER' && (
                                                    <select className="form-control" id="project_type" onChange={formChange('project_type')} value={activeForm.project_type_show} >
                                                        <option value="start_type">Project Type</option>
                                                        <option value={['SEWER_TRANSMISSION', 'Sanitary Sewer Transmission']}>Sanitary Sewer Transmission</option>
                                                        <option value={['SEWER_OTHER', 'Other Sewer']}>Other Sewer</option>
                                                    </select>
                                                )}
                                                {activeForm.project_category === 'PARK' && (
                                                    <select className="form-control" id="project_type" onChange={formChange('project_type')} value={activeForm.project_type_show} >
                                                        <option value="start_type">Project Type</option>
                                                        <option value={['PARKS_AQUISITION', 'Parks Aquisition']}>Parks Aquisition</option>
                                                        <option value={['OTHER_NON_SEWER', 'Other Non-Sewer']} >Other Non-Sewer</option>
                                                    </select>
                                                )}
                                                {activeForm.project_category === 'STORM_WATER' && (
                                                    <select className="form-control" id="project_type" onChange={formChange('project_type')} value={activeForm.project_type_show} >
                                                        <option value="start_type">Project Type</option>
                                                        <option value={['STORMWATER', 'Storm Water']}>Storm Water</option>
                                                        <option value={['LAND_AQUISITION', 'Land Aquisition']}>Land Aquisition</option>
                                                        <option value={['OTHER_NON_SEWER', 'Other Non-Sewer']} >Other Non-Sewer</option>
                                                    </select>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="col-sm-6 form-group">
                                                <label htmlFor="project_type" className="form-label" id="project_type" aria-label="Project Type" aria-required="true">* Project Type</label>
                                                <select className="form-control" id="project_type" onChange={formChange('project_type')} value={activeForm.project_type_show} >
                                                    <option value="start_type">Project Type</option>
                                                    <option value={['BOULEVARD', 'Boulevard']}>Boulevard</option>
                                                    <option value={['PARKWAY', 'Parkway']}>Parkway</option>
                                                    <option value={['TWO_LANE_BOULEVARD', 'Two-Lane Boulevard']}>Two-Lane Boulevard</option>
                                                    <option value={['TWO_LANE_PARKWAY', 'Two-Lane Parkway']}>Two-Lane Parkway</option>
                                                    <option value={['SEWER_TRANSMISSION', 'Sanitary Sewer Transmission']}>Sanitary Sewer Transmission</option>
                                                    <option value={['STORMWATER', 'Storm Water']}>Storm Water</option>
                                                    <option value={['LAND_AQUISITION', 'Land Aquisition']}>Land Aquisition</option>
                                                    <option value={['PARKS_AQUISITION', 'Parks Aquisition']}>Parks Aquisition</option>
                                                    <option value={['SEWER_OTHER', 'Other Sewer']}>Other Sewer</option>
                                                    <option value={['OTHER_NON_SEWER', 'Other Non-Sewer']} >Other Non-Sewer</option>
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6 form-group">
                                            <label htmlFor="project_status" className="form-label" id="project_status" aria-label="Project Status" aria-required="true">* Project Status</label>
                                            <select className="form-control" id="project_status" onChange={formChange('project_status')} value={activeForm.project_status_show} >
                                                <option value="start_status">Status</option>
                                                <option value={['IN_PROGRESS', 'In Progress']}>In Progress</option>
                                                <option value={['COMPLETE', 'Complete']}>Complete</option>
                                                <option value={['CLOSED', 'Closed Out']}>Closed Out</option>
                                            </select>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="* Status Date" id="status_date" >
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
                                    <DeclineDelete currentForm="/project/" selectedEntry={selectedProject} parentRoute="project" />
                                </div>
                            </form>
                        </div>
                        <div className="clearfix" />
                        {projects.id &&
                            <Uploads
                              file_content_type="accounts_project"
                              file_object_id={projects.id}
                              ariaExpanded="true"
                              panelClass="panel-collapse collapse row in"
                              permission="project"
                            />
                        }
                    </div>
                </div>

                <Footer />
            </div>
        );
    }
}

ProjectForm.propTypes = {
    activeForm: PropTypes.object,
    projects: PropTypes.array,
    agreements: PropTypes.array,
    route: PropTypes.object,
    params: PropTypes.object,
    onComponentDidMount: PropTypes.func,
    onSubmit: PropTypes.func,
    formChange: PropTypes.func,
    selectedProject: PropTypes.string,
    currentUser: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        activeForm: state.activeForm,
        projects: state.projects,
        agreements: state.agreements,
        currentUser: state.currentUser,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedProject = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(formInit());
            dispatch(getAgreements());
            if (selectedProject) {
                dispatch(getProjectID(selectedProject))
                .then((data_project) => {
                    const update = {
                        name: data_project.response.name,
                        agreement_id: data_project.response.agreement_id ? data_project.response.agreement_id.id : null,
                        agreement_id_show: data_project.response.agreement_id ? `${data_project.response.agreement_id.id},${data_project.response.agreement_id.resolution_number}` : '',
                        expansion_area: data_project.response.expansion_area,
                        expansion_area_show: `${data_project.response.expansion_area},${data_project.response.expansion_area}`,
                        project_category: data_project.response.project_category,
                        project_category_show: `${data_project.response.project_category},${data_project.response.project_category_display}`,
                        project_type: data_project.response.project_type,
                        project_type_show: `${data_project.response.project_type},${data_project.response.project_type_display}`,
                        project_description: data_project.response.project_description,
                        project_status: data_project.response.project_status,
                        project_status_show: `${data_project.response.project_status},${data_project.response.project_status_display}`,
                        status_date: data_project.response.status_date,
                    };
                    dispatch(formUpdate(update));
                });
            } else {
                const initial_constants = {
                    agreement_id_show: '',
                    expansion_area_show: '',
                    project_category_show: '',
                    project_type_show: '',
                    project_status_show: '',
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
        selectedProject,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectForm);

