import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Uploads from './Uploads';
import Notes from './Notes';

import {
    getProjectCostID,
} from '../actions/apiActions';

class ProjectCostSummary extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            currentUser,
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
                                        <h3>Project Cost Information</h3>
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
                                        <p className="col-md-3 col-sm-4 col-xs-6">Total Costs: {projectCosts.total_costs}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6 ">Credits Available: {projectCosts.dollar_values && projectCosts.dollar_values.credits_available}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6">Land Cost: {projectCosts.dollar_values && projectCosts.dollar_values.land_cost}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6">Design Cost: {projectCosts.dollar_values && projectCosts.dollar_values.design_cost}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6">Construction Cost: {projectCosts.dollar_values && projectCosts.dollar_values.construction_cost}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6">Administrative Cost: {projectCosts.dollar_values && projectCosts.dollar_values.admin_cost}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6">Management Cost: {projectCosts.dollar_values && projectCosts.dollar_values.management_cost}</p>
                                        <p className="col-md-3 col-sm-4 col-xs-6">Other Costs: {projectCosts.dollar_values && projectCosts.dollar_values.other_cost}</p>
                                    </div>
                                </div>
                            </div>

                            {projectCosts.project_id ? <div>
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
                                            <h3>Project</h3>
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
                                                        <Link to={`project/form/${projectCosts.project_id.id}`} aria-label="Edit">
                                                            <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                            <div className="col-xs-7 link-label">
                                                                Edit
                                                            </div>
                                                        </Link>
                                                    }
                                                </div>
                                                <div className="col-xs-5 ">
                                                    <Link to={`project/summary/${projectCosts.project_id.id}`} aria-label="Summary">
                                                        <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                                        <div className="col-xs-7 link-label">
                                                            Summary
                                                        </div>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xs-12">
                                            <p className="col-md-3 col-sm-4 col-xs-6">Project Name: {projectCosts.project_id.name}</p>
                                            <p className="col-sm-4 col-xs-6">Project Category: {projectCosts.project_id.project_category_display}</p>
                                            <p className="col-sm-4 col-xs-6">Project Type: {projectCosts.project_id.project_type_display}</p>
                                            <p className="col-sm-4 col-xs-6">Expansion Area: {projectCosts.project_id.expansion_area}</p>
                                            <p className="col-sm-4 col-xs-6 ">Project Status: {projectCosts.project_id.project_status_display}</p>
                                            <p className="col-sm-4 col-xs-6 ">Status Date: {projectCosts.project_id.status_date}</p>
                                            <p className="col-xs-12">Project Description: {projectCosts.project_id.project_description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div> : <div className="row section-heading" role="tab" id="headingProjectInfo">
                                <h3>Project - None</h3>
                            </div>}
                            {projectCosts && projectCosts.id &&
                                <Notes
                                  content_type="accounts_projectcostestimate"
                                  object_id={projectCosts.id}
                                  ariaExpanded="false"
                                  panelClass="panel-collapse collapse row"
                                  permission="projectcostestimate"
                                />
                            }
                            {projectCosts && projectCosts.id &&
                                <Uploads
                                  file_content_type="accounts_projectcostestimate"
                                  file_object_id={projectCosts.id}
                                  ariaExpanded="false"
                                  panelClass="panel-collapse collapse row"
                                  permission="projectcostestimate"
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

ProjectCostSummary.propTypes = {
    currentUser: PropTypes.object,
    projectCosts: PropTypes.array,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        projectCosts: state.projectCosts,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedProjectCost = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(getProjectCostID(selectedProjectCost));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCostSummary);

