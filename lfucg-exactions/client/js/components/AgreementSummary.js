import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

import {
    getAgreementID,
} from '../actions/apiActions';

class AgreementSummary extends React.Component {
    static propTypes = {
        agreements: React.PropTypes.object,
        route: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
    };

    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            agreements,
        } = this.props;

        // const plats_list = (agreements.plat_agreement && agreements.plat_agreement.length > 0) ? (
        //     map((plat) => {
        //         return (
        //             <div key={plat.id} className="col-xs-12">
        //                 <div className="row form-subheading">
        //                     <div className="col-sm-7 col-md-9">
        //                         <h3>{plat.name}</h3>
        //                     </div>
        //                     <div className="col-sm-5 col-md-3">
        //                         <div className="col-xs-5">
        //                             <Link to={`plat/summary/${plat.id}`} className="btn btn-mid-level">
        //                                 Summary
        //                             </Link>
        //                         </div>
        //                         <div className="col-xs-5 col-xs-offset-1">
        //                             <Link to={`plat/form/${plat.id}`} className="btn btn-mid-level">
        //                                 Edit
        //                             </Link>
        //                         </div>
        //                     </div>
        //                 </div>
        //                 <div className="row">
        //                     <p className="col-md-3 col-sm-4 col-xs-6">Gross Acreage: {plat.cleaned_total_acreage}</p>
        //                     <p className="col-md-3 col-sm-4 col-xs-6">Approval: {plat.is_approved ? 'Approved' : 'Not Approved'}</p>
        //                     <p className="col-md-3 col-sm-4 col-xs-6">Expansion Area: {plat.expansion_area}</p>
        //                     <p className="col-md-3 col-sm-4 col-xs-6">Slide: {plat.slide}</p>
        //                     <p className="col-md-3 col-sm-4 col-xs-6">Sewer Exactions: ${plat.sewer_due}</p>
        //                     <p className="col-md-3 col-sm-4 col-xs-6">Non-Sewer Exactions: ${plat.non_sewer_due}</p>
        //                 </div>
        //             </div>
        //         );
        //     })(agreements.plat_agreement)
        // ) : null;

        // const lots_list = (agreements.lot_agreement && agreements.lot_agreement.length > 0) ? (
        //     map((lot) => {
        //         return (
        //             <div key={lot.id} className="col-xs-12">
        //                 <div className="row form-subheading">
        //                     <div className="col-sm-7 col-md-9">
        //                         <h3>{lot.address_full}</h3>
        //                     </div>
        //                     <div className="col-sm-5 col-md-3">
        //                         <div className="col-xs-5">
        //                             <Link to={`lot/summary/${lot.id}`} className="btn btn-mid-level">
        //                                 Summary
        //                             </Link>
        //                         </div>
        //                         <div className="col-xs-5 col-xs-offset-1">
        //                             <Link to={`lot/form/${lot.id}`} className="btn btn-mid-level">
        //                                 Edit
        //                             </Link>
        //                         </div>
        //                     </div>
        //                 </div>
        //                 <div className="row">
        //                     <p className="col-md-3 col-sm-4 col-xs-6">Total Due: {lot.total_due}</p>
        //                     <p className="col-md-3 col-sm-4 col-xs-6">Approval: {lot.is_approved ? 'Approved' : 'Not Approved'}</p>
        //                     <p className="col-md-3 col-sm-4 col-xs-6">Lot Number: {lot.lot_number}</p>
        //                     <p className="col-md-3 col-sm-4 col-xs-6">Parcel ID: {lot.parcel_id}</p>
        //                 </div>
        //             </div>
        //         );
        //     })(agreements.lot_agreement)
        // ) : null;

        return (
            <div className="agreement-summary">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>AGREEMENT - SUMMARY</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'agreement/existing'} parent_name={'Agreements'} />

                <div className="inside-body">
                    <div className="container">
                        <div className="col-md-offset-1 col-md-10 panel-group" id="accordion" role="tablist" aria-multiselectable="false">
                            <a
                              role="button"
                              data-toggle="collapse"
                              data-parent="#accordion"
                              href="#collapseAgreementInfo"
                              aria-expanded="false"
                              aria-controls="collapseAgreementInfo"
                            >
                                <div className="row section-heading" role="tab" id="headingAgreementInfo">
                                    <div className="col-xs-1 caret-indicator" />
                                    <div className="col-xs-10">
                                        <h2>Agreement Information</h2>
                                    </div>
                                </div>
                            </a>
                            <div
                              id="collapseAgreementInfo"
                              className="panel-collapse collapse row"
                              role="tabpanel"
                              aria-labelledby="#headingAgreementInfo"
                            >
                                <div className="panel-body">
                                    <div className="col-xs-12">
                                        <p className="col-md-4 col-xs-6">Resolution Number: {agreements.resolution_number}</p>
                                        <p className="col-md-4 col-xs-6">Account: {agreements.account_id}</p>
                                        <p className="col-md-4 col-xs-6">Expansion Area: {agreements.expansion_area}</p>
                                        <p className="col-md-4 col-xs-6">Agreement Type: {agreements.agreement_type}</p>
                                        <p className="col-md-4 col-xs-6">Date Executed: {agreements.date_executed}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        agreements: state.agreements,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedAgreement = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(getAgreementID(selectedAgreement));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AgreementSummary);

