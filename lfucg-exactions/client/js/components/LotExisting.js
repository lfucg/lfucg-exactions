import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

import {
    getLots,
} from '../actions/apiActions';

class LotExisting extends React.Component {
    static propTypes = {
        lots: React.PropTypes.object,
        route: React.PropTypes.object,
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
                            <Link to={`lot/form/${lot.id}`} role="link" className="page-link" aria-label={`Link to ${lot.address_full}`} >
                                <h3>
                                    {lot.address_full}
                                    <i className="fa fa-link" aria-hidden="true" />
                                </h3>
                            </Link>
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
                                <p className="col-md-4 col-xs-6">Road Developer Exactions: ${lot.dues_roads_dev}</p>
                                <p className="col-md-4 col-xs-6">Road Owner Exactions: ${lot.dues_roads_own}</p>
                                <p className="col-md-4 col-xs-6">Sewer Transmission Developer Exactions: ${lot.dues_sewer_trans_dev}</p>
                                <p className="col-md-4 col-xs-6">Sewer Transmission Owner Exactions: ${lot.dues_sewer_trans_own}</p>
                                <p className="col-md-4 col-xs-6">Sewer Capacity Developer Exactions: ${lot.dues_sewer_cap_dev}</p>
                                <p className="col-md-4 col-xs-6">Sewer Capacity Owner Exactions: ${lot.dues_sewer_cap_own}</p>
                                <p className="col-md-4 col-xs-6">Parks Developer Exactions: ${lot.dues_parks_dev}</p>
                                <p className="col-md-4 col-xs-6">Parks Owner Exactions: ${lot.dues_parks_own}</p>
                                <p className="col-md-4 col-xs-6">Storm Developer Exactions: ${lot.dues_storm_dev}</p>
                                <p className="col-md-4 col-xs-6">Storm Owner Exactions: ${lot.dues_storm_own}</p>
                                <p className="col-md-4 col-xs-6">Open Space Developer Exactions: ${lot.dues_open_space_dev}</p>
                                <p className="col-md-4 col-xs-6">Open Space Owner Exactions: ${lot.dues_open_space_own}</p>
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

                <Breadcrumbs route={this.props.route} parent_link={'lot'} parent_name={'Lots'} />

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

