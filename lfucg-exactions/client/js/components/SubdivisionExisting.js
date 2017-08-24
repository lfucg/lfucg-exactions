import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

import {
    getSubdivisions,
    getSubdivisionQuery,
} from '../actions/apiActions';

import {
    formUpdate,
} from '../actions/formActions';

class SubdivisionExisting extends React.Component {
    static propTypes = {
        currentUser: React.PropTypes.object,
        subdivisions: React.PropTypes.object,
        route: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
        onSubdivisionQuery: React.PropTypes.func,
    };

    componentDidMount() {
        this.props.onComponentDidMount();
    }


    render() {
        const {
            currentUser,
            subdivisions,
            onSubdivisionQuery,
        } = this.props;

        const subdivisions_list = subdivisions.length > 0 ? (
            map((subdivision) => {
                return (
                    <div key={subdivision.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <div className="col-sm-7 col-md-9">
                                <h3>{subdivision.name}</h3>
                            </div>
                            {currentUser && currentUser.permissions && currentUser.permissions.subdivision &&
                                <div className="col-sm-5 col-md-3">
                                    <div className="col-xs-5 col-xs-offset-6">
                                        <Link to={`subdivision/form/${subdivision.id}`} className="btn btn-mid-level">
                                            Edit
                                        </Link>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="row">
                            <p className="col-md-3 col-sm-offset-1 col-sm-4 col-xs-6">Acres: {subdivision.cleaned_gross_acreage}</p>
                        </div>
                    </div>
                );
            })(subdivisions)
        ) : null;

        return (
            <div className="subdivision-existing">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <div className="col-sm-8">
                            <h1>SUBDIVISIONS - EXISTING</h1>
                        </div>
                        {currentUser && currentUser.permissions && currentUser.permissions.subdivision &&
                            <div className="col-sm-2 col-sm-offset-1">
                                <Link to={'subdivision/form/'} className="btn btn-top-level" >
                                    Create
                                </Link>
                            </div>
                        }
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} />

                <div className="row search-box">
                    <form onChange={onSubdivisionQuery('query')} className="col-sm-10 col-sm-offset-1" >
                        <fieldset>
                            <div className="col-sm-2 col-xs-12">
                                <label htmlFor="query" className="form-label">Search</label>
                            </div>
                            <div className="col-sm-10 col-xs-12">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Search Subdivisions"
                                />
                            </div>
                        </fieldset>
                    </form>
                </div>

                <div className="inside-body">
                    <div className="container">
                        {subdivisions_list}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        subdivisions: state.subdivisions,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(getSubdivisions());
        },
        onSubdivisionQuery(field) {
            return (e, ...args) => {
                const value = typeof e.target.value !== 'undefined' ? e.target.value : args[1];
                const update = {
                    [field]: value,
                };
                dispatch(formUpdate(update));
                dispatch(getSubdivisionQuery());
            };
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(SubdivisionExisting);

