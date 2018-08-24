import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Uploads from './Uploads';
import Notes from './Notes';
import LoadingScreen from './LoadingScreen';

import {
    formUpdate,
} from '../actions/formActions';

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
                        <h1>PROJECT COST SUMMARY - {projectCosts.currentProjectCost.estimate_type}</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'project-cost'} parent_name={'Project Costs'} />

                <div className="inside-body">
                    <div className="container">
                      {projectCosts && projectCosts.loadingProjectCost ? <LoadingScreen /> :
                      (
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
                                                      <Link to={`project-cost/form/${projectCosts.currentProjectCost.id}`} aria-label={`Edit ${projectCosts.currentProjectCost.estimate_type}`}>
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
                                          <p className="col-xs-12">Estimate Type: {projectCosts.currentProjectCost.estimate_type}</p>
                                          <p className="col-xs-6">Total Costs: {projectCosts.currentProjectCost.total_costs}</p>
                                          <p className="col-xs-6">Credits Available: {projectCosts.currentProjectCost.dollar_values && projectCosts.currentProjectCost.dollar_values.credits_available}</p>
                                          <p className="col-xs-6">Land Cost: {projectCosts.currentProjectCost.dollar_values && projectCosts.currentProjectCost.dollar_values.land_cost}</p>
                                          <p className="col-xs-6">Design Cost: {projectCosts.currentProjectCost.dollar_values && projectCosts.currentProjectCost.dollar_values.design_cost}</p>
                                          <p className="col-xs-6">Construction Cost: {projectCosts.currentProjectCost.dollar_values && projectCosts.currentProjectCost.dollar_values.construction_cost}</p>
                                          <p className="col-xs-6">Administrative Cost: {projectCosts.currentProjectCost.dollar_values && projectCosts.currentProjectCost.dollar_values.admin_cost}</p>
                                          <p className="col-xs-6">Management Cost: {projectCosts.currentProjectCost.dollar_values && projectCosts.currentProjectCost.dollar_values.management_cost}</p>
                                          <p className="col-xs-6">Other Costs: {projectCosts.currentProjectCost.dollar_values && projectCosts.currentProjectCost.dollar_values.other_cost}</p>
                                      </div>
                                  </div>
                              </div>

                              <ProjectsMiniSummary
                                mapSet={projectCosts.currentProjectCost && projectCosts.currentProjectCost.project_id}
                                mapQualifier={!!projectCosts.currentProjectCost && !!projectCosts.currentProjectCost.project_id}
                                singleProject
                              />

                              {projectCosts.currentProjectCost && projectCosts.currentProjectCost.id &&
                                  <Notes
                                    content_type="accounts_projectcostestimate"
                                    object_id={projectCosts.currentProjectCost.id}
                                    ariaExpanded="false"
                                    panelClass="panel-collapse collapse row"
                                    permission="projectcostestimate"
                                  />
                              }
                              {projectCosts.currentProjectCost && projectCosts.currentProjectCost.id &&
                                  <Uploads
                                    file_content_type="accounts_projectcostestimate"
                                    file_object_id={projectCosts.currentProjectCost.id}
                                    ariaExpanded="false"
                                    panelClass="panel-collapse collapse row"
                                    permission="projectcostestimate"
                                  />
                              }
                          </div>
                      )}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

ProjectCostSummary.propTypes = {
    currentUser: PropTypes.object,
    projectCosts: PropTypes.object,
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
            dispatch(getProjectCostID(selectedProjectCost))
            .then(() => {
                dispatch(formUpdate({ loading: false }));
            });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCostSummary);

