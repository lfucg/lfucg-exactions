import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';

import Navbar from './Navbar';
import Footer from './Footer';

import {
    getPlats,
} from '../actions/apiActions';

class PlatExisting extends React.Component {
    static propTypes = {
        plats: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
    };

    componentDidMount() {
        this.props.onComponentDidMount();
    }


    render() {
        const {
            plats,
        } = this.props;

        const plats_list = plats.length > 0 ? (
            map((plat) => {
                return (
                    <div key={plat.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <h3>Latitude: {plat.latitude}  x  Longitude: {plat.longitude}</h3>
                        </div>
                        <div className="row">
                            <div className="col-sm-offset-1">
                                <p className="col-md-3 col-sm-4 col-xs-6">Subdivision: {plat.subdivision ? plat.subdivision.name : 'Not listed'}</p>
                                <p className="col-md-3 col-sm-4 col-xs-6">Acreage: {plat.total_acreage}</p>
                                <p className="col-md-3 col-sm-4 col-xs-6">Plat Type: {plat.plat_type}</p>
                                <p className="col-md-3 col-sm-4 col-xs-6">Approval: {plat.is_approved ? 'Approved' : 'Not Approved'}</p>
                                <p className="col-md-3 col-sm-4 col-xs-6">Expansion Area: {plat.expansion_area}</p>
                                <p className="col-md-3 col-sm-4 col-xs-6">Buildable Lots: {plat.buildable_lots}</p>
                                <p className="col-md-3 col-sm-4 col-xs-6">Non-Buildable Lots: {plat.non_buildable_lots}</p>
                                <p className="col-md-3 col-sm-4 col-xs-6">Unit: {plat.unit}</p>
                                <p className="col-md-3 col-sm-4 col-xs-6">Section: {plat.section}</p>
                                <p className="col-md-3 col-sm-4 col-xs-6">Block: {plat.block}</p>
                                <p className="col-md-3 col-sm-4 col-xs-6">Cabinet: {plat.cabinet}</p>
                                <p className="col-md-3 col-sm-4 col-xs-6">Slide: {plat.slide}</p>
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
                        <div className="col-sm-9">
                            <h1>PLATS - EXISTING</h1>
                        </div>
                        <div className="col-sm-3">
                            <Link to="plat-page" className="btn btn-lex-reverse" role="link">Return to Plats</Link>
                        </div>
                    </div>
                </div>
                <div className="inside-body">
                    <div className="container">
                        {plats_list}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        plats: state.plats,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(getPlats());
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(PlatExisting);

