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

class LotExisting extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }


    render() {
        const {
            currentUser,
            lots,
        } = this.props;

        const lots_list = lots.length > 0 ? (
            map((lot) => {
                return (
                    <div key={lot.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <h3>{lot.address_full}</h3>
                        </div>
                        <div className="row link-row">
                            <div className="col-xs-12 col-sm-5 col-md-3 col-sm-offset-7 col-md-offset-9">
                                <div className="col-xs-5">
                                    {currentUser && currentUser.permissions && currentUser.permissions.lot &&
                                        <Link to={`lot/form/${lot.id}`} aria-label="Edit">
                                            <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                            <div className="col-xs-7 link-label">
                                                Edit
                                            </div>
                                        </Link>
                                    }
                                </div>
                                <div className="col-xs-5 ">
                                    <Link to={`lot/summary/${lot.id}`} aria-label="Summary">
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
                                <h3 className="col-xs-12">Current Exactions: {lot.lot_exactions && lot.lot_exactions.current_exactions}</h3>
                                <p className="col-md-4 col-xs-6">Plat Name: {lot.plat.name}</p>
                                <p className="col-md-4 col-xs-6">Lot Number: {lot.lot_number}</p>
                                <p className="col-md-4 col-xs-6 ">Permit ID: {lot.permit_id}</p>
                            </div>
                        </div>
                    </div>
                );
            })(lots)
        ) : null;

        return (
            <div className="lot-existing">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>LOTS - EXISTING</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} />

                <SearchBar />

                <div className="inside-body">
                    <div className="container">
                        {lots_list}
                        {lots_list ? <Pagination /> : <h1>No Results Found</h1>}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

LotExisting.propTypes = {
    currentUser: PropTypes.object,
    lots: PropTypes.array,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        lots: state.lots,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(getPagination('/lot/'));
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(LotExisting);

