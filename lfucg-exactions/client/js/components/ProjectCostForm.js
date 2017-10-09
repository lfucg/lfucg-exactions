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

import {
    formInit,
    formUpdate,
} from '../actions/formActions';

import {
    getProjects,
    getProjectCostID,
    postProjectCost,
    putProjectCost,
} from '../actions/apiActions';

class ProjectCostForm extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            activeForm,
            projects,
            projectCosts,
            onSubmit,
            formChange,
        } = this.props;

        const projectsList = projects.length > 0 &&
            (map((project) => {
                return (
                    <option key={project.id} value={[project.id, project.name]} >
                        {project.name}
                    </option>
                );
            })(projects));

        const submitEnabled =
            activeForm.project_id &&
            activeForm.estimate_type &&
            activeForm.credits_available;

        return (
            <div className="project-cost-form">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>PROJECT COSTS - CREATE</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'project-cost'} parent_name={'ProjectCosts'} />

                <div className="inside-body">
                    <div className="container">
                        <div className="col-sm-offset-1 col-sm-10">
                            <form onSubmit={onSubmit} >

                                <fieldset>
                                    <div className="row">
                                        <div className="col-sm-6 form-group">
                                            <label htmlFor="project_id" className="form-label" id="project_id" aria-label="* Project" aria-required="true">* Project</label>
                                            <select className="form-control" id="project_id" onChange={formChange('project_id')} value={activeForm.project_id_show} >
                                                <option value="start_project">* Project</option>
                                                {projectsList}
                                            </select>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="* Estimate Type" id="estimate_type">
                                                <input type="text" className="form-control" placeholder="* Estimate Type" aria-required="true" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="Land Cost" id="land_cost">
                                                <input type="number" className="form-control" placeholder="Land Cost" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="Design Cost" id="design_cost">
                                                <input type="number" className="form-control" placeholder="Design Cost" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="Construction Cost" id="construction_cost">
                                                <input type="number" className="form-control" placeholder="Construction Cost" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="Administrative Cost" id="admin_cost">
                                                <input type="number" className="form-control" placeholder="Administrative Cost" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="Management Cost" id="management_cost">
                                                <input type="number" className="form-control" placeholder="Management Cost" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="Other Costs" id="other_cost">
                                                <input type="number" className="form-control" placeholder="Other Costs" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="* Credits Available" id="credits_available">
                                                <input type="number" className="form-control" placeholder="* Credits Available" aria-required="true" />
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
                        <div className="clearfix" />
                        {projectCosts.id &&
                            <Uploads
                              file_content_type="accounts,projectcostestimate"
                              file_object_id={projectCosts.id}
                              ariaExpanded="true"
                              panelClass="panel-collapse collapse row in"
                              permission="projectcostestimate"
                            />
                        }
                    </div>
                </div>

                <Footer />
            </div>
        );
    }
}

ProjectCostForm.propTypes = {
    activeForm: PropTypes.object,
    projects: PropTypes.array,
    projectCosts: PropTypes.array,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
    onSubmit: PropTypes.func,
    formChange: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        activeForm: state.activeForm,
        projects: state.projects,
        projectCosts: state.projectCosts,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedProjectCost = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(formInit());
            dispatch(getProjects());
            if (selectedProjectCost) {
                dispatch(getProjectCostID(selectedProjectCost))
                .then((data_project_cost) => {
                    const update = {
                        project_id: data_project_cost.response.project_id ? data_project_cost.response.project_id.id : null,
                        project_id_show: data_project_cost.response.project_id ? `${data_project_cost.response.project_id.id},${data_project_cost.response.project_id.name}` : '',
                        estimate_type: data_project_cost.response.estimate_type,
                        land_cost: data_project_cost.response.land_cost,
                        design_cost: data_project_cost.response.design_cost,
                        construction_cost: data_project_cost.response.construction_cost,
                        admin_cost: data_project_cost.response.admin_cost,
                        management_cost: data_project_cost.response.management_cost,
                        credits_available: data_project_cost.response.credits_available,
                    };
                    dispatch(formUpdate(update));
                });
            } else {
                const initial_constants = {
                    project_id_show: '',
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
            if (selectedProjectCost) {
                dispatch(putProjectCost(selectedProjectCost))
                .then(() => {
                    hashHistory.push(`project-cost/summary/${selectedProjectCost}`);
                });
            } else {
                dispatch(postProjectCost())
                .then((data_post) => {
                    hashHistory.push(`project-cost/summary/${data_post.response.id}`);
                });
            }
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCostForm);
