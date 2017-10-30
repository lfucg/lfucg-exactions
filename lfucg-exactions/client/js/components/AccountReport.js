import React from 'react';
import { connect } from 'react-redux';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

import {
    getAccountID,
} from '../actions/apiActions';

class AccountReport extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }


    render() {
        const {
            accounts,
            lots,
            accounts,
        } = this.props;

        const accountLots = lots && lots.length > 0 && (map((lot) => {
            return (
                <div className="row" key={lot.id}>
                    <div className="col-sm-5 report-data">{lot.address_full}</div>
                    <div className="col-sm-7">
                        <div className="col-sm-3 report-data">{lot.parcel_id}</div>
                        <div className="col-sm-3 report-data">{lot.lot_exactions && lot.lot_exactions.current_exactions}</div>
                        <div className="col-sm-3 report-data">{lot.lot_exactions && lot.lot_exactions.non_sewer_due}</div>
                        <div className="col-sm-3 report-data right-border">{lot.lot_exactions && lot.lot_exactions.sewer_due}</div>
                    </div>
                </div>
            );
        })(lots));

        const accountZones = accounts && accounts.account_zone && accounts.account_zone.length > 0 && (map((zone) => {
            return (
                <div className="row" key={zone.id}>
                    <div className="col-sm-3 report-data">{zone.zone}</div>
                    <div className="col-sm-3 report-data right-border">{zone.cleaned_acres}</div>
                </div>
            );
        })(accounts.account_zone));

        return (
            <div className="account-report">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>PLATS - {accounts.name} - REPORT</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'account'} parent_name={'Accounts'} />

                <div className="inside-body">
                    <div className="container">
                        <h2>Report Preview</h2>
                        <div className="clearfix" />
                        <div className="report-table">
                            <div className="row">
                                <h3 className="col-sm-6">Account</h3>
                            </div>
                            <div className="row report-header">
                                <h5 className="col-sm-3">Subdivision</h5>
                                <h5 className="col-sm-3">Total Acreage</h5>
                                <h5 className="col-sm-3">Buildable Lots</h5>
                                <h5 className="col-sm-3 right-border">Non-Buildable Lots</h5>
                            </div>
                            <div className="row">
                                <div className="col-sm-3 report-data">{accounts.subdivision && accounts.subdivision.name}</div>
                                <div className="col-sm-3 report-data">{accounts.total_acreage}</div>
                                <div className="col-sm-3 report-data">{accounts.buildable_lots}</div>
                                <div className="col-sm-3 report-data right-border">{accounts.non_buildable_lots}</div>
                            </div>
                            <div className="row" />
                            <div className="row">
                                <h3 className="col-sm-6">Developer Account</h3>
                            </div>
                            <div className="row report-header">
                                <h5 className="col-sm-3 right-border">Developer Name</h5>
                            </div>
                            <div className="row">
                                <div className="col-sm-3 report-data right-border">{accounts.id && accounts.account_name}</div>
                            </div>
                            <div className="row" />
                            <div className="row">
                                <h3 className="col-sm-6">Account Zones</h3>
                            </div>
                            <div className="row report-header">
                                <h5 className="col-sm-3">Zone</h5>
                                <h5 className="col-sm-3 right-border">Acres</h5>
                            </div>
                            {accountZones}
                            <div className="row" />
                            <div className="row">
                                <h3>
                                    <div className="col-sm-6">
                                        Lots
                                    </div>
                                    <div className="col-sm-6">
                                        Remaining Lots: {accounts.account_exactions && accounts.account_exactions.remaining_lots}
                                    </div>
                                </h3>
                            </div>
                            <div className="row report-header">
                                <h5 className="col-sm-5">Lot Address</h5>
                                <div className="col-sm-7">
                                    <h5>
                                        <div className="col-sm-3">Parcel ID</div>
                                        <div className="col-sm-3 report-wrap-header">Current Exactions Due</div>
                                        <div className="col-sm-3 report-wrap-header">Non-Sewer Exactions Due</div>
                                        <div className="col-sm-3 report-wrap-header right-border">Sewer Exactions Due</div>
                                    </h5>
                                </div>
                            </div>
                            {accountLots}
                        </div>

                        <a
                          className="btn btn-lex col-sm-3"
                          href={`../api/export_account_csv/?account=${accounts.id}`}
                        >Export CSV</a>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

AccountReport.propTypes = {
    accounts: PropTypes.array,
    lots: PropTypes.array,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        accounts: state.accounts,
        lots: state.lots,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedAccount = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(getAccountID(selectedAccount))
            .then((account_data) => {
                if (account_data.response.account) {
                    dispatch(getAccountID(account_data.response.account));
                }
            });
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(AccountReport);
