import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

import {
    getProjectID,
    getProjectCostID,
} from '../actions/apiActions';

class ProjectCostSummary extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            currentUser,
            projects,
            projectCosts,
        } = this.props;

        return (
            <div className="project-cost-summary">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>PROJECT COST - SUMMARY</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'project-cost'} parent_name={'Project Costs'} />

                <div className="inside-body">
                    <div className="container">
                        <div className="col-md-offset-1 col-md-10 panel-group" id="accordion" role="tablist" aria-multiselectable="false">
                            <a
                              role="button"
                              data-toggle="collapse"
                              data-parent="#accordion"
                              href="#collapseProjectCostInfo"
                              aria-expanded="false"
                              aria-controls="collapseProjectCostInfo"
                            >
                                <div className="row section-heading" role="tab" id="headingProjectCostInfo">
                                    <div className="col-xs-1 caret-indicator" />
                                    <div className="col-xs-10">
                                        <h2>Project Cost Information</h2>
                                    </div>
                                </div>
                            </a>
                            <div
                              id="collapseProjectCostInfo"
                              className="panel-collapse collapse row"
                              role="tabpanel"
                              aria-labelledby="#headingProjectCostInfo"
                            >
                                <div className="panel-body">
                                    <div className="row link-row">
                                        <div className="col-xs-12 col-sm-5 col-md-3 col-sm-offset-7 col-md-offset-9">
                                            <div className="col-xs-5 col-xs-offset-5">
                                                {currentUser && currentUser.permissions && currentUser.permissions.projectcostestimate &&
                                                    <Link to={`project-cost/form/${projectCosts.id}`} aria-label="Edit">
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
                                        <p className="col-md-3 col-sm-4 col-xs-6">Estimate Type: {projectCosts.estimate_type}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6">Total Costs: ${projectCosts.total_costs}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6 ">Credits Available: {projectCosts.credits_available}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6">Land Cost: ${projectCosts.land_cost}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6">Design Cost: ${projectCosts.design_cost}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6">Construction Cost: ${projectCosts.construction_cost}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6">Administrative Cost: ${projectCosts.admin_cost}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6">Management Cost: ${projectCosts.management_cost}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6">Other Costs: ${projectCosts.other_cost}</p>
                                    </div>
                                </div>
                            </div>

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
                                        <h2>Project</h2>
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
                                            <div className="col-xs-5">
                                                {currentUser && currentUser.permissions && currentUser.permissions.project &&
                                                    <Link to={`project/form/${projects.id}`} aria-label="Edit">
                                                        <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                        <div className="col-xs-7 link-label">
                                                            Edit
                                                        </div>
                                                    </Link>
                                                }
                                            </div>
                                            <div className="col-xs-5 ">
                                                <Link to={`project/summary/${projects.id}`} aria-label="Summary">
                                                    <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                                    <div className="col-xs-7 link-label">
                                                        Summary
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12">
                                        <p className="col-md-3 col-sm-4 col-xs-6">Project Name: {projects.name}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6">Project Category: {projects.project_category_display}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6">Project Type: {projects.project_type_display}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6">Expansion Area: {projects.expansion_area}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6 ">Project Status: {projects.project_status_display}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6 ">Status Date: {projects.status_date}</p>
                                        <p className="col-xs-12">Project Description: {projects.project_description}</p>
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

ProjectCostSummary.propTypes = {
    currentUser: PropTypes.object,
    projects: PropTypes.object,
    projectCosts: PropTypes.object,
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
    const selectedProjectCost = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(getProjectCostID(selectedProjectCost))
            .then((data_projectCost) => {
                if (data_projectCost.response.project_id) {
                    dispatch(getProjectID(data_projectCost.response.project_id));
                }
            });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCostSummary);

