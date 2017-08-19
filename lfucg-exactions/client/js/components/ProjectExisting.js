import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

import {
    getProjects,
    getProjectQuery,
} from '../actions/apiActions';

import {
    formUpdate,
} from '../actions/formActions';

class ProjectExisting extends React.Component {
    static propTypes = {
        projects: React.PropTypes.object,
        route: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
        onProjectQuery: React.PropTypes.func,
    };

    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            projects,
            onProjectQuery,
        } = this.props;

        const projects_list = projects.length > 0 ? (
            map((project) => {
                return (
                    <div key={project.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <div className="col-sm-7 col-md-9">
                                <h3>Project Category : {project.project_category_display}</h3>
                            </div>
                            <div className="col-sm-5 col-md-3">
                                <div className="col-xs-5">
                                    <Link to={`project/summary/${project.id}`} className="btn btn-mid-level">
                                        Summary
                                    </Link>
                                </div>
                                <div className="col-xs-5 col-xs-offset-1">
                                    <Link to={`project/form/${project.id}`} className="btn btn-mid-level">
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-offset-1">
                                <p className="col-md-4 col-xs-6">Agreement: {project.agreement_id}</p>
                                <p className="col-md-4 col-xs-6">Project Type: {project.project_type_display}</p>
                                <p className="col-md-4 col-xs-6">Expansion Area: {project.expansion_area}</p>
                                <p className="col-md-4 col-xs-6 ">Project Status: {project.project_status_display}</p>
                                <p className="col-md-4 col-xs-6 ">Status Date: {project.status_date}</p>
                                <p className="col-xs-12">Project Description: {project.project_description}</p>
                            </div>
                        </div>
                    </div>
                );
            })(projects)
        ) : null;

        return (
            <div className="project-existing">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <div className="col-sm-8">
                            <h1>PROJECTS - EXISTING</h1>
                        </div>
                        <div className="col-sm-2 col-sm-offset-1">
                            <Link to={'project/form/'} className="btn btn-top-level" >
                                Create
                            </Link>
                        </div>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} />

                <div className="row search-box">
                    <form onChange={onProjectQuery('query')} className="col-sm-10 col-sm-offset-1" >
                        <fieldset>
                            <div className="col-sm-2 col-xs-12">
                                <label htmlFor="query" className="form-label">Search</label>
                            </div>
                            <div className="col-sm-10 col-xs-12">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Search Projects"
                                />
                            </div>
                        </fieldset>
                    </form>
                </div>

                <div className="inside-body">
                    <div className="container">
                        {projects_list}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        projects: state.projects,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(getProjects());
        },
        onProjectQuery(field) {
            return (e, ...args) => {
                const value = typeof e.target.value !== 'undefined' ? e.target.value : args[1];
                const update = {
                    [field]: value,
                };
                dispatch(formUpdate(update));
                dispatch(getProjectQuery());
            };
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectExisting);

