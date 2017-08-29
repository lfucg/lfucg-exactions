import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

import {
    getProjectCosts,
    getProjectCostQuery,
} from '../actions/apiActions';

import {
    formUpdate,
} from '../actions/formActions';

class ProjectCostExisting extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            currentUser,
            projectCosts,
            onProjectCostQuery,
        } = this.props;

        const projectCosts_list = projectCosts.length > 0 ? (
            map((projectCost) => {
                return (
                    <div key={projectCost.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <div className="col-sm-7 col-md-9">
                                <h3>Project Cost Category: {projectCost.estimate_type}</h3>
                            </div>
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
            })(projectCosts)
        ) : null;

        return (
            <div className="projectCost-existing">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>PROJECT COSTS - EXISTING</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} />

                <div className="row search-box">
                    <form onChange={onProjectCostQuery('query')} className="col-sm-10 col-sm-offset-1" >
                        <fieldset>
                            <div className="col-sm-2 col-xs-12">
                                <label htmlFor="query" className="form-label">Search</label>
                            </div>
                            <div className="col-sm-10 col-xs-12">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Search ProjectCosts"
                                />
                            </div>
                        </fieldset>
                    </form>
                </div>

                <div className="inside-body">
                    <div className="container">
                        {projectCosts_list}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

ProjectCostExisting.propTypes = {
    currentUser: PropTypes.object,
    projectCosts: PropTypes.object,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
    onProjectCostQuery: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        projectCosts: state.projectCosts,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(getProjectCosts());
        },
        onProjectCostQuery(field) {
            return (e, ...args) => {
                const value = typeof e.target.value !== 'undefined' ? e.target.value : args[1];
                const update = {
                    [field]: value,
                };
                dispatch(formUpdate(update));
                dispatch(getProjectCostQuery());
            };
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCostExisting);

