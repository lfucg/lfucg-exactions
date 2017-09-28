import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Pagination from './Pagination';
import SearchBar from './SearchBar';

import {
    getPagination,
} from '../actions/apiActions';

import {
    formUpdate,
} from '../actions/formActions';

class ProjectExisting extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            currentUser,
            projects,
        } = this.props;

        const projects_list = projects.length > 0 &&
            map((project) => {
                return (
                    <div key={project.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <h3>{project.name}</h3>
                        </div>
                        <div className="row link-row">
                            <div className="col-xs-12 col-sm-5 col-md-3 col-sm-offset-7 col-md-offset-9">
                                <div className="col-xs-5">
                                    {currentUser && currentUser.permissions && currentUser.permissions.project &&
                                        <Link to={`project/form/${project.id}`} aria-label="Edit">
                                            <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                            <div className="col-xs-7 link-label">
                                                Edit
                                            </div>
                                        </Link>
                                    }
                                </div>
                                <div className="col-xs-5 ">
                                    <Link to={`project/summary/${project.id}`} aria-label="Summary">
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
                                {project.agreement_id &&
                                    <p className="col-md-4 col-xs-6">Agreement: {project.agreement_id.resolution_number}</p>
                                }
                                <p className="col-md-4 col-xs-6">Project Category: {project.project_category_display}</p>
                                <p className="col-md-4 col-xs-6">Project Type: {project.project_type_display}</p>
                                <p className="col-md-4 col-xs-6 ">Project Status: {project.project_status_display}</p>
                                <p className="col-md-4 col-xs-6 ">Status Date: {project.status_date}</p>
                            </div>
                        </div>
                    </div>
                );
            })(projects);

        return (
            <div className="project-existing">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>PROJECTS - EXISTING</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} />

                <SearchBar />

                <div className="inside-body">
                    <div className="container">
                        {projects_list}
                        {projects_list ? <Pagination /> : <h1>No Results Found</h1>}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

ProjectExisting.propTypes = {
    currentUser: PropTypes.object,
    projects: PropTypes.object,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        projects: state.projects,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(getPagination('/project/'));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectExisting);

