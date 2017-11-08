import React from 'react';
import { connect } from 'react-redux';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

import {
    getAgreementID,
    getAgreementProjects,
    getAgreementPayments,
    getAgreementAccountLedgers,
} from '../actions/apiActions';

class AgreementReport extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }


    render() {
        const {
            agreements,
            projects,
            payments,
            accountLedgers,
        } = this.props;

        const projectsList = projects && projects.length > 0 && (map((project) => {
            return (
                <div className="row" key={project.id}>
                    <div className="col-sm-3 report-data">{project.project_category_display}</div>
                    <div className="col-sm-3 report-data">{project.project_type_display}</div>
                    <div className="col-sm-3 report-data right-border">{project.project_status_display}</div>
                </div>
            );
        })(projects));

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
            <div className="agreement-report">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>AGREEMENTS - {agreements.resolution_number} - REPORT</h1>
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
                            <div className="row report-header">
                                <h5 className="col-sm-6">Resolution</h5>
                                <h5 className="col-sm-6 right-border">Account</h5>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 report-data">{agreements.resolution_number}</div>
                                <div className="col-sm-6 report-data right-border">{agreements.account_id && agreements.account_id.account_name}</div>
                            </div>
                            <div className="row" />

                            <div className="row">
                                <h3 className="col-sm-6">Projects</h3>
                            </div>
                            <div className="row report-header">
                                <h5 className="col-sm-3">Category</h5>
                                <h5 className="col-sm-3">Type</h5>
                                <h5 className="col-sm-3 right-border">Status</h5>
                            </div>
                            {projectsList}
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
                                    <h5 className="col-sm-2">Open Space</h5>
                                    <h5 className="col-sm-2">Sewer Trans</h5>
                                    <h5 className="col-sm-2 right-border">Sewer Cap</h5>
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
                          href={`../api/export_agreement_csv/?agreement=${agreements.id}`}
                          disabled={!agreements.id}
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
    projects: PropTypes.array,
    payments: PropTypes.array,
    accountLedgers: PropTypes.array,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        agreements: state.agreements,
        projects: state.projects,
        payments: state.payments,
        accountLedgers: state.accountLedgers,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedAgreement = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(getAgreementID(selectedAgreement));
            dispatch(getAgreementProjects(selectedAgreement));
            dispatch(getAgreementPayments(selectedAgreement));
            dispatch(getAgreementAccountLedgers(selectedAgreement));
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(AgreementReport);
