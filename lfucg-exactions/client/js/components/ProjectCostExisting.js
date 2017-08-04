import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';

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
    static propTypes = {
        projectCosts: React.PropTypes.object,
        route: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
        onProjectCostQuery: React.PropTypes.func,
    };

    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            projectCosts,
            onProjectCostQuery,
        } = this.props;

        const projectCosts_list = projectCosts.length > 0 ? (
            map((projectCost) => {
                return (
                    <div key={projectCost.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <div className="col-sm-7 col-md-9">
                                <h3>ProjectCost Category : ProjectCost Type: {projectCost.projectCost_category} : {projectCost.projectCost_type}</h3>
                            </div>
                            <div className="col-sm-5 col-md-3">
                                <div className="col-xs-5">
                                    <Link to={`project-cost/summary/${projectCost.id}`} className="btn btn-mid-level">
                                        Summary
                                    </Link>
                                </div>
                                <div className="col-xs-5 col-xs-offset-1">
                                    <Link to={`project-cost/form/${projectCost.id}`} className="btn btn-mid-level">
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-offset-1">
                                <p className="col-md-4 col-xs-6">Project: {projectCost.project_id}</p>
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
                        <div className="col-sm-8">
                            <h1>PROJECT COSTS - EXISTING</h1>
                        </div>
                        <div className="col-sm-2 col-sm-offset-1">
                            <Link to={'project-cost/form/'} className="btn btn-top-level" >
                                Create
                            </Link>
                        </div>
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

function mapStateToProps(state) {
    return {
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

