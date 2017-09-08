import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';
import PropTypes from 'prop-types';

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
    componentDidMount() {
        this.props.onComponentDidMount();
    }


    render() {
        const {
            currentUser,
            subdivisions,
            onSubdivisionQuery,
        } = this.props;

        const subdivisions_list = subdivisions && subdivisions.length > 0 &&
            map((subdivision) => {
                return (
                    <div key={subdivision.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <div className="col-sm-7 col-md-9">
                                <h3>{subdivision.name}</h3>
                            </div>
                        </div>
                        <div className="row link-row">
                            <div className="col-xs-12 col-sm-5 col-md-3 col-sm-offset-7 col-md-offset-9">
                                <div className="col-xs-5">
                                    {currentUser && currentUser.permissions && currentUser.permissions.subdivision &&
                                        <Link to={`subdivision/form/${subdivision.id}`} aria-label="Edit">
                                            <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                            <div className="col-xs-7 link-label">
                                                Edit
                                            </div>
                                        </Link>
                                    }
                                </div>
                                <div className="col-xs-5 ">
                                    <Link to={`subdivision/summary/${subdivision.id}`} aria-label="Summary">
                                        <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                        <div className="col-xs-7 link-label">
                                            Summary
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <p className="col-md-3 col-sm-offset-1 col-sm-4 col-xs-6">Acres: {subdivision.cleaned_gross_acreage}</p>
                        </div>
                    </div>
                );
            })(subdivisions);

        return (
            <div className="subdivision-existing">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>SUBDIVISIONS - EXISTING</h1>
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

SubdivisionExisting.propTypes = {
    currentUser: PropTypes.object,
    subdivisions: PropTypes.object,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
    onSubdivisionQuery: PropTypes.func,
};

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

