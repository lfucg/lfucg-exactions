import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Uploads from './Uploads';
import Notes from './Notes';

import ProjectsMiniSummary from './ProjectsMiniSummary';

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
                        <h1>PROJECT COST SUMMARY - {projectCosts.estimate_type}</h1>
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
                                        <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                                            <div className="col-xs-5 col-xs-offset-5">
                                                {currentUser && currentUser.permissions && currentUser.permissions.projectcostestimate &&
                                                    <Link to={`project-cost/form/${projectCosts.id}`} aria-label={`Edit ${projectCosts.estimate_type}`}>
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
                                        <p className="col-xs-12">Estimate Type: {projectCosts.estimate_type}</p>
                                        <p className="col-xs-6">Total Costs: {projectCosts.total_costs}</p>
                                        <p className="col-xs-6">Credits Available: {projectCosts.dollar_values && projectCosts.dollar_values.credits_available}</p>
                                        <p className="col-xs-6">Land Cost: {projectCosts.dollar_values && projectCosts.dollar_values.land_cost}</p>
                                        <p className="col-xs-6">Design Cost: {projectCosts.dollar_values && projectCosts.dollar_values.design_cost}</p>
                                        <p className="col-xs-6">Construction Cost: {projectCosts.dollar_values && projectCosts.dollar_values.construction_cost}</p>
                                        <p className="col-xs-6">Administrative Cost: {projectCosts.dollar_values && projectCosts.dollar_values.admin_cost}</p>
                                        <p className="col-xs-6">Management Cost: {projectCosts.dollar_values && projectCosts.dollar_values.management_cost}</p>
                                        <p className="col-xs-6">Other Costs: {projectCosts.dollar_values && projectCosts.dollar_values.other_cost}</p>
                                    </div>
                                </div>
                            </div>

                            <ProjectsMiniSummary
                              mapSet={projectCosts && projectCosts.project_id}
                              mapQualifier={projectCosts && projectCosts.project_id}
                              singleProject={true}
                            />

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

