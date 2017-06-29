import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';

import Navbar from './Navbar';
import Footer from './Footer';

import {
    getLots,
} from '../actions/apiActions';

class LotExisting extends React.Component {
    static propTypes = {
        lots: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
    };

    componentDidMount() {
        this.props.onComponentDidMount();
    }


    render() {
        const {
            lots,
        } = this.props;

        const lots_list = lots.length > 0 ? (
            map((lot) => {
                return (
                    <div key={lot.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <h3>Parcel ID , Lot Number:  {lot.parcel_id ? <span>{lot.parcel_id} , {lot.lot_number}</span> : <span> -- , {lot.lot_number}</span>}</h3>
                        </div>
                        <div className="row">
                            <div className="col-sm-offset-1">
                                <p className="col-md-4 col-xs-12">Plat Name: {lot.plat}</p>
                                <p className="col-md-8 col-xs-12">Address: {lot.address_full}</p>
                                <p className="col-md-4 col-xs-6">Lot Number: {lot.lot_number}</p>
                                <p className="col-md-4 col-xs-6 ">Permit ID: {lot.permit_id}</p>
                                <p className="col-md-4 col-xs-6">Latitude: {lot.latitude}</p>
                                <p className="col-md-4 col-xs-6">Longitude: {lot.longitude}</p>
                                <p className="col-md-4 col-xs-6">Approved: {lot.is_approved ? 'Approved' : 'Not Approved'}</p>
                                <p className="col-md-4 col-xs-6">Road Development Dues: ${lot.dues_roads_dev}</p>
                                <p className="col-md-4 col-xs-6">Road Own Dues: ${lot.dues_roads_own}</p>
                                <p className="col-md-4 col-xs-6">Sewer Trans. Development Dues: ${lot.dues_sewer_trans_dev}</p>
                                <p className="col-md-4 col-xs-6">Sewer Trans. Own Dues: ${lot.dues_sewer_trans_own}</p>
                                <p className="col-md-4 col-xs-6">Sewer Cap. Development Dues: ${lot.dues_sewer_cap_dev}</p>
                                <p className="col-md-4 col-xs-6">Sewer Cap. Own Dues: ${lot.dues_sewer_cap_own}</p>
                                <p className="col-md-4 col-xs-6">Parks Development Dues: ${lot.dues_parks_dev}</p>
                                <p className="col-md-4 col-xs-6">Parks Own Dues: ${lot.dues_parks_own}</p>
                                <p className="col-md-4 col-xs-6">Storm Development Dues: ${lot.dues_storm_dev}</p>
                                <p className="col-md-4 col-xs-6">Storm Own Dues: ${lot.dues_storm_own}</p>
                                <p className="col-md-4 col-xs-6">Open Space Development Dues: ${lot.dues_open_space_dev}</p>
                                <p className="col-md-4 col-xs-6">Open Space Own Dues: ${lot.dues_open_space_own}</p>
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
                        <div className="col-sm-9">
                            <h1>LOTS - EXISTING</h1>
                        </div>
                        <div className="col-sm-3">
                            <Link to="lot-page" className="btn btn-lex-reverse" role="link">Return to Lots</Link>
                        </div>
                    </div>
                </div>
                <div className="inside-body">
                    <div className="container">
                        {lots_list}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        lots: state.lots,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(getLots());
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(LotExisting);

