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
            plats,
            lots,
        } = this.props;

        const platLots = lots && lots.length > 0 && (map((lot) => {
            return (
                <tr key={lot.id} className="report-table">
                    <td>{lot.address_full}</td>
                    <td>{lot.parcel_id}</td>
                    <td>{lot.lot_exactions && lot.lot_exactions.current_exactions}</td>
                    <td>{lot.lot_exactions && lot.lot_exactions.non_sewer_due}</td>
                    <td>{lot.lot_exactions && lot.lot_exactions.sewer_due}</td>
                </tr>
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
                        <h2>Report Preview</h2>
                        <div className="clearfix" />

                        <table>
                            <h3>Plat</h3>
                            <tr className="report-table">
                                <th>Subdivision</th>
                                <th>Total Acreage</th>
                                <th>Buildable Lots</th>
                                <th>Non-Buildable Lots</th>
                            </tr>
                            <tr className="report-table">
                                <td>{plats.subdivision && plats.subdivision.name}</td>
                                <td>{plats.total_acreage}</td>
                                <td>{plats.buildable_lots}</td>
                                <td>{plats.non_buildable_lots}</td>
                            </tr>
                            <tr />
                            <h3>Lots</h3>
                            <tr className="report-table">
                                <th>Lot Address</th>
                                <th>Parcel ID</th>
                                <th>Current Exactions Due</th>
                                <th>Non-Sewer Exactions Due</th>
                                <th>Sewer Exactions Due</th>
                            </tr>
                            {platLots}
                        </table>

                        <a
                          className="btn btn-lex col-sm-3"
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
    plats: PropTypes.array,
    lots: PropTypes.array,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        plats: state.plats,
        lots: state.lots,
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
