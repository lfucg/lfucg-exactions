import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import Pagination from './Pagination';

class ProjectsMiniSummary extends React.Component {
    render() {
        const {
            currentUser,
        } = this.props;

        const projectsList = this.props.mapQualifier && this.props.singleProject ?
            (<div>
                <div className="row link-row">
                    <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                        <div className="col-xs-5">
                            {currentUser && currentUser.permissions && currentUser.permissions.project &&
                                <Link to={`project/form/${this.props.mapSet.id}`} aria-label={`Edit ${this.props.mapSet.name}`}>
                                    <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                    <div className="col-xs-7 link-label">
                                        Edit
                                    </div>
                                </Link>
                            }
                        </div>
                        <div className="col-xs-5 ">
                            <Link to={`project/summary/${this.props.mapSet.id}`} aria-label={`${this.props.mapSet.name} Summary`}>
                                <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                <div className="col-xs-7 link-label">
                                    Summary
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-xs-12">
                    <p className="col-xs-12">Project Name: {this.props.mapSet.name}</p>
                    <p className="col-sm-4 col-xs-6">Project Category: {this.props.mapSet.project_category_display}</p>
                    <p className="col-sm-8 col-xs-6">Project Type: {this.props.mapSet.project_type_display}</p>
                    <p className="col-sm-4 col-xs-6">Expansion Area: {this.props.mapSet.expansion_area}</p>
                    <p className="col-sm-4 col-xs-6 ">Project Status: {this.props.mapSet.project_status_display}</p>
                    <p className="col-sm-4 col-xs-6 ">Status Date: {this.props.mapSet.status_date}</p>
                    <p className="col-xs-12">Project Description: {this.props.mapSet.project_description}</p>
                </div>
            </div>) : (
                this.props.mapQualifier && map((project) => {
                    return (
                        <div key={project.id} className="col-xs-12">
                            <div className="row form-subheading">
                                <h3>{project.name}</h3>
                            </div>
                            <div className="row link-row">
                                <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                                    <div className="col-xs-5">
                                        {currentUser && currentUser.permissions && currentUser.permissions.project &&
                                            <Link to={`project/form/${project.id}`} aria-label={`Edit ${project.name}`}>
                                                <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                <div className="col-xs-7 link-label">
                                                    Edit
                                                </div>
                                            </Link>
                                        }
                                    </div>
                                    <div className="col-xs-5 ">
                                        <Link to={`project/summary/${project.id}`} aria-label={`${project.name} Summary`}>
                                            <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                            <div className="col-xs-7 link-label">
                                                Summary
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <p className="col-sm-4 col-xs-6">Project Category: {project.project_category}</p>
                                <p className="col-sm-4 col-xs-6">Expansion Area: {project.expansion_area}</p>
                                <p className="col-sm-4 col-xs-6">Project Type: {project.project_type_display}</p>
                                <p className="col-sm-4 col-xs-6">Project Status: {project.project_status_display}</p>
                                <p className="col-sm-4 col-xs-6">Status Date: {project.status_date}</p>
                                <p className="col-xs-12">Project Description: {project.project_description}</p>
                            </div>
                        </div>
                    );
                })(this.props.mapSet)
            )
        ;

        return (
            <div className="existing-page-links">
                {projectsList ? (
                    <div>
                        <a
                          role="button"
                          data-toggle="collapse"
                          data-parent="#accordion"
                          href="#collapseAccountProjects"
                          aria-expanded="false"
                          aria-controls="collapseAccountProjects"
                        >
                            <div className="row section-heading" role="tab" id="headingAccountProjects">
                                <div className="col-xs-1 caret-indicator" />
                                <div className="col-xs-10">
                                    {!this.props.singleProject ?
                                        <h3>Projects</h3> :
                                        <h3>Project Information</h3>
                                    }
                                </div>
                            </div>
                        </a>
                        <div
                          id="collapseAccountProjects"
                          className="panel-collapse collapse row"
                          role="tabpanel"
                          aria-labelledby="#headingAccountProjects"
                        >
                            <div className="panel-body">
                                {projectsList}
                                {projectsList ? 
                                    <Pagination 
                                        next={this.props.projects && this.props.projects.next}
                                        prev={this.props.projects && this.props.projects.prev}
                                        count={this.props.projects && this.props.projects.count} 
                                    /> : 
                                    <h1>No Results Found</h1>
                                }
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="row section-heading" role="tab" id="headingAccountProjects">
                        <h3 tabIndex="0">Projects - {!!this.props.mapSet ? 'None' : <i className="fa fa-spinner fa-pulse fa-fw" />}</h3>
                    </div>
                )}
            </div>
        );
    }
}

ProjectsMiniSummary.propTypes = {
    currentUser: PropTypes.object,
    mapSet: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    mapQualifier: PropTypes.bool,
    singleProject: PropTypes.bool,
    projects: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
    };
}

export default connect(mapStateToProps)(ProjectsMiniSummary);
