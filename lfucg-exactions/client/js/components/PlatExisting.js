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

class PlatExisting extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            currentUser,
            plats,
        } = this.props;

        const plats_list = plats.length > 0 ? (
            map((plat) => {
                return (
                    <div key={plat.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <div className="col-sm-7 col-md-9">
                                <h3>{plat.name}</h3>
                            </div>
                        </div>
                        <div className="row link-row">
                            <div className="col-xs-12 col-sm-7 col-md-5 col-sm-offset-5 col-md-offset-7">
                                <div className="col-xs-3">
                                    {currentUser && currentUser.permissions && currentUser.permissions.plat &&
                                        <Link to={`plat/form/${plat.id}`} aria-label="Edit">
                                            <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                            <div className="col-xs-7 link-label">
                                                Edit
                                            </div>
                                        </Link>
                                    }
                                </div>
                                <div className="col-xs-4">
                                    {currentUser && currentUser.permissions && currentUser.permissions.plat &&
                                        <Link to={`plat/report/${plat.id}`} aria-label="Report">
                                            <i className="fa fa-line-chart link-icon col-xs-4" aria-hidden="true" />
                                            <div className="col-xs-7 link-label">
                                                Report
                                            </div>
                                        </Link>
                                    }
                                </div>
                                <div className="col-xs-4 ">
                                    <Link to={`plat/summary/${plat.id}`} aria-label="Summary">
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
                                <p className="col-sm-4 col-xs-6">Expansion Area: {plat.expansion_area}</p>
                                <p className="col-sm-4 col-xs-6">Plat Type: {plat.plat_type_display}</p>
                                <p className="col-sm-4 col-xs-6">Unit: {plat.unit}</p>
                                <p className="col-sm-4 col-xs-6">Section: {plat.section}</p>
                                <p className="col-sm-4 col-xs-6">Block: {plat.block}</p>
                                <p className="col-sm-4 col-xs-6">Slide: {plat.slide}</p>
                            </div>
                        </div>
                    </div>
                );
            })(plats)
        ) : null;

        return (
            <div className="plat-existing">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>PLATS - EXISTING</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} />

                <SearchBar />

                <div className="inside-body">
                    <div className="container">
                        {plats_list}
                        {plats_list ? <Pagination /> : <h1>No Results Found</h1>}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

PlatExisting.propTypes = {
    currentUser: PropTypes.object,
    plats: PropTypes.object,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        plats: state.plats,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(getPagination('/plat/'));
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(PlatExisting);

