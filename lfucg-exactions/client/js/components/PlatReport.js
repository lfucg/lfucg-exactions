import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Notes from './Notes';

import {
    getPlatID,
    getPlatLots,
    getAccountID,
} from '../actions/apiActions';

class PlatReport extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }


    render() {
        const {
            currentUser,
            plats,
            lots,
            accounts,
        } = this.props;

        const platZonesList = plats.plat_zone && (map((single_plat_zone) => {
            return (
                <div key={single_plat_zone.id} className="col-xs-12">
                    <div className="row form-subheading">
                        <h3>{single_plat_zone.zone}</h3>
                    </div>
                    <div className="row">
                        <div className="col-sm-offset-1">
                            <p className="col-sm-4 col-xs-6">Zone: {single_plat_zone.zone}</p>
                            <p className="col-sm-4 col-xs-6">Gross Acreage: {single_plat_zone.cleaned_acres}</p>
                        </div>
                    </div>
                </div>
            );
        })(plats.plat_zone));

        const platZoneExactions = plats.plat_zone && (map((plat_exaction) => {
            return (
                <div key={plat_exaction.id}>
                    <div className="col-xs-4">
                        <div className="row table-border">
                            <h4 className="table-data">{plat_exaction.zone}</h4>
                        </div>
                        <div className="row table-border">
                            <p className="table-data">{plat_exaction.cleaned_acres}</p>
                        </div>
                        <div className="row table-border">
                            <p className="table-data">$ {plat_exaction.dues_roads}</p>
                        </div>
                        <div className="row table-border">
                            <p className="table-data">$ {plat_exaction.dues_open_spaces}</p>
                        </div>
                        <div className="row table-border">
                            <p className="table-data">$ {plat_exaction.dues_sewer_cap}</p>
                        </div>
                        <div className="row table-border">
                            <p className="table-data">$ {plat_exaction.dues_sewer_trans}</p>
                        </div>
                        <div className="row table-border">
                            <p className="table-data">$ {plat_exaction.dues_parks}</p>
                        </div>
                        <div className="row table-border">
                            <p className="table-data">$ {plat_exaction.dues_storm_water}</p>
                        </div>
                    </div>
                </div>
            );
        })(plats.plat_zone));

        const platLots = lots && lots.length > 0 && (map((lot) => {
            return (
                <div key={lot.id}>
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
                            <p className="col-md-4 col-xs-6">Lot Number: {lot.lot_number}</p>
                            <p className="col-md-4 col-xs-6 ">Permit ID: {lot.permit_id}</p>
                            <p className="col-md-4 col-xs-6 ">Parcel ID: {lot.parcel_id}</p>
                        </div>
                    </div>
                </div>
            );
        })(lots));

        return (
            <div className="plat-report">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>PLATS - {plats.name} - REPORT</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'plat'} parent_name={'Plats'} />

                <div className="inside-body">
                    <div className="container">
                        hello
                        <a
                          className="btn btn-primary col-sm-2 col-sm-offset-1"
                          href={`../api/export_plat_csv/?plat=${plats.id}`}
                        >Export CSV</a>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

PlatReport.propTypes = {
    currentUser: PropTypes.object,
    plats: PropTypes.object,
    lots: PropTypes.object,
    accounts: PropTypes.object,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        plats: state.plats,
        lots: state.lots,
        accounts: state.accounts,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedPlat = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(getPlatLots(selectedPlat));
            dispatch(getPlatID(selectedPlat))
            .then((plat_data) => {
                if (plat_data.response.account) {
                    dispatch(getAccountID(plat_data.response.account));
                }
            });
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(PlatReport);
