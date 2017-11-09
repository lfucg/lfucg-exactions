import React from 'react';
import { connect } from 'react-redux';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

import {
    getAccountID,
    getAccountPayments,
    getAccountAccountLedgers,
} from '../actions/apiActions';

class AccountReport extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }


    render() {
        const {
            accounts,
            payments,
            accountLedgers,
        } = this.props;

        const platsList = accounts && accounts.plat_account && accounts.plat_account.length > 0 && (map((plat) => {
            return (
                <div className="row" key={plat.id}>
                    <div className="col-sm-3 report-data">{plat.subdivision && plat.subdivision.name}</div>
                    <div className="col-sm-3 report-data">{plat.cabinet} - {plat.slide}</div>
                    <div className="col-sm-2 report-data">{plat.total_acreage}</div>
                    <div className="col-sm-2 report-data">{plat.buildable_lots}</div>
                    <div className="col-sm-2 report-data right-border">{plat.non_buildable_lots}</div>
                </div>
            );
        })(accounts.plat_account));

        const lotsList = accounts && accounts.lot_account && accounts.lot_account.length > 0 && (map((lot) => {
            return (
                <div className="row" key={lot.id}>
                    <div className="col-sm-5 report-data right-border">{lot.address_full}</div>
                    <div className="col-sm-7">
                        <div className="col-sm-3 report-data">{lot.parcel_id}</div>
                        <div className="col-sm-3 report-data">{lot.lot_exactions && lot.lot_exactions.current_exactions}</div>
                        <div className="col-sm-3 report-data">{lot.lot_exactions && lot.lot_exactions.non_sewer_due}</div>
                        <div className="col-sm-3 report-data right-border">{lot.lot_exactions && lot.lot_exactions.sewer_due}</div>
                    </div>
                </div>
            );
        })(accounts.lot_account));

        const paymentsList = payments && payments.length > 0 && (map((payment) => {
            return (
                <div className="row" key={payment.id}>
                    <div className="col-sm-2 report-data right-border">{payment.payment_type_display}</div>
                    <div className="col-sm-10">
                        <div className="col-sm-2 report-data">{payment.paid_roads}</div>
                        <div className="col-sm-2 report-data">{payment.paid_parks}</div>
                        <div className="col-sm-2 report-data">{payment.paid_storm}</div>
                        <div className="col-sm-2 report-data">{payment.paid_open_space}</div>
                        <div className="col-sm-2 report-data">{payment.paid_sewer_trans}</div>
                        <div className="col-sm-2 report-data right-border">{payment.paid_sewer_cap}</div>
                    </div>
                </div>
            );
        })(payments));

        const ledgersList = accountLedgers && accountLedgers.length > 0 && (map((ledger) => {
            return (
                <div className="row" key={ledger.id}>
                    <div className="col-sm-2 report-data right-border">{ledger.entry_type_display}</div>
                    <div className="col-sm-10">
                        <div className="col-sm-2 report-data">{ledger.roads}</div>
                        <div className="col-sm-2 report-data">{ledger.parks}</div>
                        <div className="col-sm-2 report-data">{ledger.storm}</div>
                        <div className="col-sm-2 report-data">{ledger.open_space}</div>
                        <div className="col-sm-2 report-data">{ledger.sewer_trans}</div>
                        <div className="col-sm-2 report-data right-border">{ledger.sewer_cap}</div>
                    </div>
                </div>
            );
        })(accountLedgers));

        return (
            <div className="account-report">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>ACCOUNTS - {accounts.account_name} - REPORT</h1>
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
                                <h5 className="col-sm-6">Account Name</h5>
                                <h5 className="col-sm-6 right-border">Balance</h5>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 report-data">{accounts.account_name}</div>
                                <div className="col-sm-6 report-data right-border">{accounts.balance && accounts.balance.balance}</div>
                            </div>
                            <div className="row" />

                            <div className="row">
                                <h3 className="col-sm-6">Plats</h3>
                            </div>
                            <div className="row report-header">
                                <h5 className="col-sm-3">Subdivision</h5>
                                <h5 className="col-sm-3">Cabinet - Slide</h5>
                                <h5 className="col-sm-2 report-wrap-header">Total Acreage</h5>
                                <h5 className="col-sm-2 report-wrap-header">Buildable Lots</h5>
                                <h5>
                                    <div className="col-sm-2 report-wrap-header right-border">Non-Buildable Lots</div>
                                </h5>
                            </div>
                            {platsList}
                            <div className="row" />

                            <div className="row">
                                <h3 className="col-sm-6">Lots</h3>
                            </div>
                            <div className="row report-header">
                                <h5 className="col-sm-5 right-border">Lot Address</h5>
                                <div className="col-sm-7">
                                    <h5 className="col-sm-3">Parcel ID</h5>
                                    <h5>
                                        <div className="col-sm-3 report-wrap-header">Current Exactions Due</div>
                                        <div className="col-sm-3 report-wrap-header">Non-Sewer Exactions Due</div>
                                        <div className="col-sm-3 report-wrap-header right-border">Sewer Exactions Due</div>
                                    </h5>
                                </div>
                            </div>
                            {lotsList}
                            <div className="row" />

                            <div className="row">
                                <h3>
                                    <div className="col-sm-6">
                                        Payments
                                    </div>
                                </h3>
                            </div>
                            <div className="row report-header">
                                <h5 className="col-sm-2 right-border">Payment Type</h5>
                                <div className="col-sm-10">
                                    <h5 className="col-sm-2">Roads</h5>
                                    <h5 className="col-sm-2">Parks</h5>
                                    <h5 className="col-sm-2">Stormwater</h5>
                                    <h5 className="col-sm-2 report-wrap-header">Open Space</h5>
                                    <h5 className="col-sm-2 report-wrap-header">Sewer Trans</h5>
                                    <h5 className="col-sm-2 report-wrap-header right-border">Sewer Cap</h5>
                                </div>
                            </div>
                            {paymentsList}
                            <div className="row" />

                            <div className="row">
                                <h3>
                                    <div className="col-sm-6">
                                        Credit Transfers
                                    </div>
                                </h3>
                            </div>
                            <div className="row report-header">
                                <h5 className="col-sm-2 right-border">Entry Type</h5>
                                <div className="col-sm-10">
                                    <h5 className="col-sm-2">Roads</h5>
                                    <h5 className="col-sm-2">Parks</h5>
                                    <h5 className="col-sm-2">Stormwater</h5>
                                    <h5 className="col-sm-2">Open Space</h5>
                                    <h5 className="col-sm-2">Sewer Trans</h5>
                                    <h5 className="col-sm-2 right-border">Sewer Cap</h5>
                                </div>
                            </div>
                            {ledgersList}
                        </div>

                        <a
                          className="btn btn-lex col-sm-3"
                          href={`../api/export_account_csv/?account=${accounts.id}`}
                          disabled={!accounts.id}
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
    payments: PropTypes.array,
    accountLedgers: PropTypes.array,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        accounts: state.accounts,
        payments: state.payments,
        accountLedgers: state.accountLedgers,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedAccount = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(getAccountID(selectedAccount));
            dispatch(getAccountPayments(selectedAccount));
            dispatch(getAccountAccountLedgers(selectedAccount));
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(AccountReport);
