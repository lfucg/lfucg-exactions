import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Notes from './Notes';
import LoadingScreen from './LoadingScreen';

import {
    formUpdate,
} from '../actions/formActions';

import PlatsMiniSummary from './PlatsMiniSummary';
import LotsMiniSummary from './LotsMiniSummary';


import {
    getSubdivisionID,
    getSubdivisionPlats,
    getSubdivisionLots,
} from '../actions/apiActions';

class SubdivisionSummary extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            currentUser,
            subdivisions,
            plats,
            lots,
            activeForm,
        } = this.props;

        let subdivision_acreage_used = 0;
        const subdivisionPlats = plats && plats.length > 0 &&
            map((plat) => {
                subdivision_acreage_used += parseFloat(plat.cleaned_total_acreage);
                const cabinet = plat.cabinet ? `${plat.cabinet}-` : '';
                const slide = plat.slide ? plat.slide : plat.name;
                let plat_zone_number = 0;
                const plat_zone_list =
                    map((plat_zone) => {
                        plat_zone_number += 1;
                        return (
                            <div key={`${plat_zone.zone}_${plat_zone_number}`}>
                                <p className="col-xs-6">Zone {plat_zone_number}: {plat_zone.zone}</p>
                                <p className="col-xs-6">Zone {plat_zone_number} Acreage: {plat_zone.cleaned_acres}</p>
                            </div>
                        );
                    })(plat.plat_zone);
                return (
                    <div key={plat.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <div className="col-sm-7 col-md-9">
                                <h3>{cabinet}{slide}</h3>
                            </div>
                        </div>
                        <div className="row link-row">
                            <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                                <div className="col-xs-5">
                                    {currentUser && currentUser.permissions && currentUser.permissions.plat &&
                                        <Link to={`plat/form/${plat.id}`} aria-label="Edit">
                                            <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                            <div className="col-xs-7 link-label">
                                                Edit
                                            </div>
                                        </Link>
                                    }
                                </div>
                                <div className="col-xs-5 ">
                                    <Link to={`plat/summary/${plat.id}`} aria-label="Summary">
                                        <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                        <div className="col-xs-7 link-label">
                                            Summary
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <p className="col-xs-6"><strong>{plat.is_approved ? 'Approved' : 'Not Approved'}</strong></p>
                            <p className="col-xs-6">Gross Acreage: {plat.cleaned_total_acreage}</p>
                            <p className="col-xs-6">Name: {plat.name}</p>
                            <p className="col-xs-6">Expansion Area: {plat.expansion_area}</p>
                            <p className="col-xs-6">Sewer Exactions: {plat.plat_exactions && plat.plat_exactions.plat_sewer_due}</p>
                            <p className="col-xs-6">Non-Sewer Exactions: {plat.plat_exactions && plat.plat_exactions.plat_non_sewer_due}</p>
                            {plat_zone_list}
                        </div>
                    </div>
                );
            })(plats);

        return (
            <div className="subdivision-summary">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>SUBDIVISION SUMMARY - {subdivisions.name}</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'subdivision'} parent_name={'Subdivisions'} />

                <div className="inside-body">
                    <div className="container">
                        {activeForm.loading ? <LoadingScreen /> :
                        (
                            <div className="col-md-offset-1 col-md-10 panel-group" id="accordion" role="tablist" aria-multiselectable="false">
                                <a
                                  role="button"
                                  data-toggle="collapse"
                                  data-parent="#accordion"
                                  href="#collapseGeneralSubdivision"
                                  aria-expanded="false"
                                  aria-controls="collapseGeneralSubdivision"
                                >
                                    <div className="row section-heading" role="tab" id="headingSubdivision">
                                        <div className="col-xs-1 caret-indicator" />
                                        <div className="col-xs-10">
                                            <h3>General Subdivision Information</h3>
                                        </div>
                                    </div>
                                </a>
                                <div
                                  id="collapseGeneralSubdivision"
                                  className="panel-collapse collapse row"
                                  role="tabpanel"
                                  aria-labelledby="#headingSubdivision"
                                >
                                    <div className="panel-body">
                                        <div className="row link-row">
                                            <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                                                <div className="col-xs-5 col-xs-offset-5">
                                                    {currentUser && currentUser.permissions && currentUser.permissions.subdivision &&
                                                        <Link to={`subdivision/form/${subdivisions.id}`} aria-label={`Edit ${subdivisions.name}`}>
                                                            <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                            <div className="col-xs-7 link-label">
                                                                Edit
                                                            </div>
                                                        </Link>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12">
                                        <p className="col-xs-6">Subdivision Name: {subdivisions.name}</p>
                                        <p className="col-xs-6">Gross Acreage: {subdivisions.cleaned_gross_acreage}</p>
                                        <p className="col-xs-6">Acreage Used: {subdivision_acreage_used}</p>
                                        <p className="col-xs-6">Acreage Available: {subdivisions.cleaned_gross_acreage - subdivision_acreage_used}</p>
                                    </div>
                                </div>
                                {subdivisions && subdivisions.id &&
                                    <Notes
                                      content_type="plats_subdivision"
                                      object_id={subdivisions.id}
                                      ariaExpanded="false"
                                      panelClass="panel-collapse collapse row"
                                      permission="subdivision"
                                    />
                                }

                                <PlatsMiniSummary
                                  mapSet={plats}
                                  mapQualifier={plats && plats.length > 0}
                                />

                                <LotsMiniSummary
                                  mapSet={lots}
                                  mapQualifier={lots && lots.length > 0}
                                />

                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

SubdivisionSummary.propTypes = {
    currentUser: PropTypes.object,
    subdivisions: PropTypes.array,
    plats: PropTypes.array,
    lots: PropTypes.array,
    route: PropTypes.object,
    activeForm: PropTypes.object,
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        subdivisions: state.subdivisions,
        plats: state.plats,
        lots: state.lots,
        activeForm: state.activeForm,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedSubdivision = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(getSubdivisionID(selectedSubdivision));
            dispatch(getSubdivisionPlats(selectedSubdivision));
            dispatch(getSubdivisionLots(selectedSubdivision))
            .then(() => {
                dispatch(formUpdate({ loading: false }));
            });
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(SubdivisionSummary);
