import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Uploads from './Uploads';
import Notes from './Notes';

import AgreementsMiniSummary from './AgreementsMiniSummary';

import {
    getProjectID,
    getProjectProjectCosts,
} from '../actions/apiActions';

class ProjectSummary extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            currentUser,
            projects,
            projectCosts,
        } = this.props;

        const projectCostEstimates = projectCosts && projectCosts.length > 0 &&
            (map((projectCost) => {
                return (
                    <div key={projectCost.id}>
                        <div className="row form-subheading">
                            <h3>{projectCost.estimate_type}</h3>
                        </div>
                        <div className="row link-row">
                            <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                                <div className="col-xs-5">
                                    {currentUser && currentUser.permissions && currentUser.permissions.projectcostestimate &&
                                        <Link to={`project-cost/form/${projectCost.id}`} aria-label={`Edit ${projectCost.estimate_type}`}>
                                            <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                            <div className="col-xs-7 link-label">
                                                Edit
                                            </div>
                                        </Link>
                                    }
                                </div>
                                <div className="col-xs-5 ">
                                    <Link to={`project-cost/summary/${projectCost.id}`} aria-label={`${projectCost.estimate_type} Summary`}>
                                        <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                        <div className="col-xs-7 link-label">
                                            Summary
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-offset-1">
                                <p className="col-md-4 col-xs-6">Project: {projectCost.project_id.name}</p>
                                <p className="col-md-4 col-xs-6">Total Costs: {projectCost.total_costs}</p>
                                <p className="col-md-4 col-xs-6 ">Credits Available: {projectCost.dollar_values && projectCost.dollar_values.credits_available}</p>
                            </div>
                        </div>
                    </div>
                );
            })(projectCosts));

        return (
            <div className="project-summary">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>PROJECT SUMMARY - {projects.name}</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'project'} parent_name={'Projects'} />

                <div className="inside-body">
                    <div className="container">
                        <div className="col-md-offset-1 col-md-10 panel-group" id="accordion" role="tablist" aria-multiselectable="false">
                            <a
                              role="button"
                              data-toggle="collapse"
                              data-parent="#accordion"
                              href="#collapseProjectInfo"
                              aria-expanded="false"
                              aria-controls="collapseProjectInfo"
                            >
                                <div className="row section-heading" role="tab" id="headingProjectInfo">
                                    <div className="col-xs-1 caret-indicator" />
                                    <div className="col-xs-10">
                                        <h3>Project Information</h3>
                                    </div>
                                </div>
                            </a>
                            <div
                              id="collapseProjectInfo"
                              className="panel-collapse collapse row"
                              role="tabpanel"
                              aria-labelledby="#headingProjectInfo"
                            >
                                <div className="panel-body">
                                    <div className="row link-row">
                                        <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                                            <div className="col-xs-5 col-xs-offset-5">
                                                {currentUser && currentUser.permissions && currentUser.permissions.project &&
                                                    <Link to={`project/form/${projects.id}`} aria-label={`Edit ${projects.name}`}>
                                                        <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                        <div className="col-xs-7 link-label">
                                                            Edit
                                                        </div>
                                                    </Link>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12">
                                        <p className="col-md-4 col-xs-6">Project Name: {projects.name}</p>
                                        <p className="col-md-4 col-xs-6">Project Category: {projects.project_category_display}</p>
                                        <p className="col-md-4 col-xs-6">Project Type: {projects.project_type_display}</p>
                                        <p className="col-md-4 col-xs-6">Expansion Area: {projects.expansion_area}</p>
                                        <p className="col-md-4 col-xs-6 ">Project Status: {projects.project_status_display}</p>
                                        <p className="col-md-4 col-xs-6 ">Status Date: {projects.status_date}</p>
                                        <p className="col-xs-12">Project Description: {projects.project_description}</p>
                                    </div>
                                </div>
                            </div>
                            {projects && projects.id &&
                                <Notes
                                  content_type="accounts_project"
                                  object_id={projects.id}
                                  ariaExpanded="false"
                                  panelClass="panel-collapse collapse row"
                                  permission="project"
                                />
                            }

                            {projectCostEstimates ? (
                                <div>
                                    <a
                                      role="button"
                                      data-toggle="collapse"
                                      data-parent="#accordion"
                                      href="#collapseCostEstimates"
                                      aria-expanded="false"
                                      aria-controls="collapseCostEstimates"
                                    >
                                        <div className="row section-heading" role="tab" id="headingCostEstimates">
                                            <div className="col-xs-1 caret-indicator" />
                                            <div className="col-xs-10">
                                                <h3>Project Cost Estimates</h3>
                                            </div>
                                        </div>
                                    </a>
                                    <div
                                      id="collapseCostEstimates"
                                      className="panel-collapse collapse row"
                                      role="tabpanel"
                                      aria-labelledby="#headingCostEstimates"
                                    >
                                        <div className="panel-body">
                                            <div className="col-xs-12">
                                                {projectCostEstimates}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="row section-heading" role="tab" id="headingCostEstimates">
                                    <h3>Project Cost Estimates - None</h3>
                                </div>
                            )}

                            <AgreementsMiniSummary
                              mapSet={projects.agreement_id}
                              mapQualifier={projects.agreement_id}
                              singleAgreement
                            />

                            {projects.id &&
                                <Uploads
                                  file_content_type="accounts_project"
                                  file_object_id={projects.id}
                                  ariaExpanded="false"
                                  panelClass="panel-collapse collapse row"
                                  permission="project"
                                />
                            }
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

ProjectSummary.propTypes = {
    currentUser: PropTypes.object,
    projects: PropTypes.array,
    projectCosts: PropTypes.array,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        projects: state.projects,
        projectCosts: state.projectCosts,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedProject = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(getProjectID(selectedProject));
            dispatch(getProjectProjectCosts(selectedProject));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSummary);

