import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

import {
    getAgreementID,
    getProjectID,
} from '../actions/apiActions';

class ProjectSummary extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            currentUser,
            agreements,
            projects,
        } = this.props;

        const projectCostEstimates = projects.project_cost_estimate && projects.project_cost_estimate.length > 0 &&
            (map((projectCost) => {
                return (
                    <div key={projectCost.id}>
                        <div className="row form-subheading">
                            <h3>{projectCost.estimate_type}</h3>
                        </div>
                        <div className="row link-row">
                            <div className="col-xs-12 col-sm-5 col-md-3 col-sm-offset-7 col-md-offset-9">
                                <div className="col-xs-5">
                                    {currentUser && currentUser.permissions && currentUser.permissions.projectcostestimate &&
                                        <Link to={`project-cost/form/${projectCost.id}`} aria-label="Edit">
                                            <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                            <div className="col-xs-7 link-label">
                                                Edit
                                            </div>
                                        </Link>
                                    }
                                </div>
                                <div className="col-xs-5 ">
                                    <Link to={`project-cost/summary/${projectCost.id}`} aria-label="Summary">
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
                                <p className="col-md-4 col-xs-6">Total Costs: {projectCost.total_costs}</p>
                                <p className="col-md-4 col-xs-6 ">Credits Available: {projectCost.credits_available}</p>
                            </div>
                        </div>
                    </div>
                );
            })(projects.project_cost_estimate));


        return (
            <div className="project-summary">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>PROJECT - SUMMARY</h1>
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
                                        <h2>Project Information</h2>
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
                                        <div className="col-xs-12 col-sm-5 col-md-3 col-sm-offset-7 col-md-offset-9">
                                            <div className="col-xs-5 col-xs-offset-5">
                                                {currentUser && currentUser.permissions && currentUser.permissions.project &&
                                                    <Link to={`project/form/${projects.id}`} aria-label="Edit">
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
                                                <h2>Project Cost Estimates</h2>
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
                                <div className="row section-heading" role="tab" id="headingAccountPlats">
                                    <h2>Project Cost Estimates - None</h2>
                                </div>
                            )}

                            <a
                              role="button"
                              data-toggle="collapse"
                              data-parent="#accordion"
                              href="#collapseAgreementInfo"
                              aria-expanded="false"
                              aria-controls="collapseAgreementInfo"
                            >
                                <div className="row section-heading" role="tab" id="headingAgreementInfo">
                                    <div className="col-xs-1 caret-indicator" />
                                    <div className="col-xs-10">
                                        <h2>Agreement</h2>
                                    </div>
                                </div>
                            </a>
                            <div
                              id="collapseAgreementInfo"
                              className="panel-collapse collapse row"
                              role="tabpanel"
                              aria-labelledby="#headingAgreementInfo"
                            >
                                <div className="panel-body">
                                    <div className="row link-row">
                                        <div className="col-xs-12 col-sm-5 col-md-3 col-sm-offset-7 col-md-offset-9">
                                            <div className="col-xs-5">
                                                {currentUser && currentUser.permissions && currentUser.permissions.agreement &&
                                                    <Link to={`agreement/form/${agreements.id}`} aria-label="Edit">
                                                        <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                        <div className="col-xs-7 link-label">
                                                            Edit
                                                        </div>
                                                    </Link>
                                                }
                                            </div>
                                            <div className="col-xs-5 ">
                                                <Link to={`agreement/summary/${agreements.id}`} aria-label="Summary">
                                                    <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                                    <div className="col-xs-7 link-label">
                                                        Summary
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12">
                                        <p className="col-md-4 col-xs-6">Resolution Number: {agreements.resolution_number}</p>
                                        <p className="col-md-4 col-xs-6">Expansion Area: {agreements.expansion_area}</p>
                                        <p className="col-md-4 col-xs-6">Agreement Type: {agreements.agreement_type_display}</p>
                                        <p className="col-md-4 col-xs-6">Date Executed: {agreements.date_executed}</p>
                                    </div>
                                </div>
                            </div>
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
    agreements: PropTypes.object,
    projects: PropTypes.object,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        agreements: state.agreements,
        projects: state.projects,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedProject = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(getProjectID(selectedProject))
            .then((data_project) => {
                if (data_project.response.agreement_id) {
                    dispatch(getAgreementID(data_project.response.agreement_id));
                }
            });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSummary);

