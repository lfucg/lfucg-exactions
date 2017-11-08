import React from 'react';
import { connect } from 'react-redux';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

import {
    getAgreementID,
    getAccountID,
} from '../actions/apiActions';

class AgreementReport extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

                            // <div className="row report-header">
                            //     <h5 className="col-sm-3">Subdivision</h5>
                            //     <h5 className="col-sm-3">Total Acreage</h5>
                            //     <h5 className="col-sm-3">Buildable Lots</h5>
                            //     <h5 className="col-sm-3 right-border">Non-Buildable Lots</h5>
                            // </div>
                            // <div className="row">
                            //     <div className="col-sm-3 report-data">{agreements.subdivision && agreements.subdivision.name}</div>
                            //     <div className="col-sm-3 report-data">{agreements.total_acreage}</div>
                            //     <div className="col-sm-3 report-data">{agreements.buildable_lots}</div>
                            //     <div className="col-sm-3 report-data right-border">{agreements.non_buildable_lots}</div>
                            // </div>
                            // <div className="row" />
                            // <div className="row">
                            //     <h3 className="col-sm-6">Developer Account</h3>
                            // </div>
                            // <div className="row report-header">
                            //     <h5 className="col-sm-3 right-border">Developer Name</h5>
                            // </div>
                            // <div className="row">
                            //     <div className="col-sm-3 report-data right-border">{accounts.id && accounts.account_name}</div>
                            // </div>
                            // <div className="row" />
                            // <div className="row">
                            //     <h3 className="col-sm-6">Agreement Zones</h3>
                            // </div>
                            // <div className="row report-header">
                            //     <h5 className="col-sm-3">Zone</h5>
                            //     <h5 className="col-sm-3 right-border">Acres</h5>
                            // </div>
                            // {agreementZones}
                            // <div className="row" />
                            // <div className="row">
                            //     <h3>
                            //         <div className="col-sm-6">
                            //             Lots
                            //         </div>
                            //         <div className="col-sm-6">
                            //             Remaining Lots: {agreements.agreement_exactions && agreements.agreement_exactions.remaining_lots}
                            //         </div>
                            //     </h3>
                            // </div>
                            // <div className="row report-header">
                            //     <h5 className="col-sm-5">Lot Address</h5>
                            //     <div className="col-sm-7">
                            //         <h5>
                            //             <div className="col-sm-3">Parcel ID</div>
                            //             <div className="col-sm-3 report-wrap-header">Current Exactions Due</div>
                            //             <div className="col-sm-3 report-wrap-header">Non-Sewer Exactions Due</div>
                            //             <div className="col-sm-3 report-wrap-header right-border">Sewer Exactions Due</div>
                            //         </h5>
                            //     </div>
                            // </div>
                            // {agreementLots}

    render() {
        const {
            agreements,
            accounts,
        } = this.props;

        return (
            <div className="agreement-report">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>PLATS - {agreements.resolution_number} - REPORT</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'agreement'} parent_name={'Agreements'} />

                <div className="inside-body">
                    <div className="container">
                        <h2>Report Preview</h2>
                        <div className="clearfix" />
                        <div className="report-table">
                            <div className="row">
                                <h3 className="col-sm-6">Agreement</h3>
                            </div>
                        </div>

                        <a
                          className="btn btn-lex col-sm-3"
                          href={`../api/export_agreement_csv/?agreement=${agreements.id}`}
                        >Export CSV</a>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

AgreementReport.propTypes = {
    agreements: PropTypes.array,
    accounts: PropTypes.array,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        agreements: state.agreements,
        accounts: state.accounts,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedAgreement = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(getAgreementID(selectedAgreement))
            .then((agreement_data) => {
                if (agreement_data.response.account) {
                    dispatch(getAccountID(agreement_data.response.account));
                }
            });
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(AgreementReport);
