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
import ExistingPageLinks from './ExistingPageLinks';
import LoadingScreen from './LoadingScreen';

import {
    formUpdate,
} from '../actions/formActions';

import {
    getPagination,
    getProjectQuick,
} from '../actions/apiActions';


class ProjectCostExisting extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            currentUser,
            projectCosts,
            projects,
        } = this.props;

        const projectsList = projects && projects.length > 0 &&
            (map((single_project) => {
                return {
                    id: single_project.id,
                    name: single_project.name,
                };
            })(projects));

        const projectCosts_list = projectCosts.length > 0 ? (
            map((projectCost) => {
                return (
                    <div key={projectCost.id} className="col-xs-12">
                        {(currentUser.id || projectCost.is_approved) && <div>
                            <ExistingPageLinks
                              linkStart="project-cost"
                              approval={projectCost.is_approved}
                              title={`Project Cost Category: ${projectCost.estimate_type}`}
                              permissionModel="projectcostestimate"
                              instanceID={projectCost.id}
                              uniqueReport={false}
                            />
                            <div className="row">
                                <div className="col-sm-offset-1">
                                    <p className="col-xs-12">Project: {projectCost.project_id.name}</p>
                                    <p className="col-xs-6">Total Costs: {projectCost.total_costs}</p>
                                    <p className="col-xs-6 ">Credits Available: {projectCost.dollar_values && projectCost.dollar_values.credits_available}</p>
                                </div>
                            </div>
                        </div>}
                    </div>
                );
            })(projectCosts.projectCosts)
        ) : null;

        return (
            <div className="projectCost-existing">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>PROJECT COSTS - EXISTING</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} route_permission="projectcostestimate" />

                <SearchBar
                  apiCalls={[getProjectQuick]}
                  advancedSearch={[
                    { filterField: 'filter_project_id', displayName: 'Project', list: projectsList },
                    { filterField: 'filter_is_approved', displayName: 'Approval', list: [{ id: true, name: 'Approved' }, { id: false, name: 'Unapproved' }] },
                  ]}
                  currentPage="Project Costs"
                  csvEndpoint="../api/project_estimate_search_csv/?"
                />

                <div className="inside-body">
                    <div className="container">
                        {projectCosts && projectCosts.loadingProjectCost ? <LoadingScreen /> :
                        (
                            <div>
                                {projectCosts_list}
                                {projectCosts_list ? 
                                    <Pagination 
                                        next={projectCosts.next}
                                        prev={projectCosts.prev}
                                        count={projectCosts.count} 
                                    /> : 
                                    <h1>No Results Found</h1>
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

ProjectCostExisting.propTypes = {
    currentUser: PropTypes.object,
    projects: PropTypes.array,
    projectCosts: PropTypes.object,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        projectCosts: state.projectCosts,
        projects: state.projects && state.projects.projects,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(getPagination('/estimate/'))
            .then(() => {
                dispatch(formUpdate({ loading: false }));
            });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCostExisting);

