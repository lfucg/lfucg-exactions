import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map, filter, compose } from 'ramda';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Notes from './Notes';

import {
    getSubdivisionID,
    getSubdivisionPlats,
    getLots,
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
        } = this.props;

        const subdivisionPlats = plats && plats.length > 0 &&
            map((plat) => {
                return (
                    <div key={plat.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <div className="col-sm-7 col-md-9">
                                <h3>{plat.name}</h3>
                            </div>
                        </div>
                        <div className="row link-row">
                            <div className="col-xs-12 col-sm-5 col-md-3 col-sm-offset-7 col-md-offset-9">
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
                            <p className="col-md-3 col-sm-4 col-xs-6">Gross Acreage: {plat.cleaned_total_acreage}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Approval: {plat.is_approved ? 'Approved' : 'Not Approved'}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Expansion Area: {plat.expansion_area}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Slide: {plat.slide}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Sewer Exactions: {plat.plat_exactions && plat.plat_exactions.plat_sewer_due}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Non-Sewer Exactions: {plat.plat_exactions && plat.plat_exactions.plat_non_sewer_due}</p>
                        </div>
                    </div>
                );
            })(plats);

        const platIds = plats && plats.length > 0 && map(plat => plat.id)(plats);

        const subdivisionLots = lots && plats && plats.length > 0 && compose(
                map((lot) => {
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
                }),
                filter(lot => (platIds.indexOf(lot.plat.id) !== -1)),
            )(lots);

        return (
            <div className="subdivision-summary">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>SUBDIVISIONS - {subdivisions.name}</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'subdivision'} parent_name={'Subdivisions'} />

                <div className="inside-body">
                    <div className="container">
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
                                        <div className="col-xs-12 col-sm-5 col-md-3 col-sm-offset-7 col-md-offset-9">
                                            <div className="col-xs-5 col-xs-offset-5">
                                                {currentUser && currentUser.permissions && currentUser.permissions.subdivision &&
                                                    <Link to={`subdivision/form/${subdivisions.id}`} aria-label="Edit">
                                                        <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                        <div className="col-xs-7 link-label">
                                                            Edit
                                                        </div>
                                                    </Link>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12">
                                        <p className="col-xs-6">Subdivision Name: {subdivisions.name}</p>
                                        <p className="col-xs-6">Gross Acreage: {subdivisions.cleaned_gross_acreage}</p>
                                    </div>
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

                            {subdivisionPlats ? (
                                <div>
                                    <a
                                      role="button"
                                      data-toggle="collapse"
                                      data-parent="#accordion"
                                      href="#collapsePlats"
                                      aria-expanded="false"
                                      aria-controls="collapsePlats"
                                    >
                                        <div className="row section-heading" role="tab" id="headingPlats">
                                            <div className="col-xs-1 caret-indicator" />
                                            <div className="col-xs-8 col-xs-offset-1">
                                                <h3>Plats</h3>
                                            </div>
                                        </div>
                                    </a>
                                    <div
                                      id="collapsePlats"
                                      className="panel-collapse collapse row"
                                      role="tabpanel"
                                      aria-labelledby="#headingPlats"
                                    >
                                        <div className="panel-body">
                                            <div className="col-xs-12">
                                                {subdivisionPlats}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="row section-heading" role="tab" id="headingAccountPlats">
                                    <h3>Plats - None</h3>
                                </div>
                            )}
                            {subdivisionLots ?
                                <div>
                                    <a
                                      role="button"
                                      data-toggle="collapse"
                                      data-parent="#accordion"
                                      href="#collapseLots"
                                      aria-expanded="false"
                                      aria-controls="collapseLots"
                                    >
                                        <div className="row section-heading" role="tab" id="headingLots">
                                            <div className="col-xs-1 caret-indicator" />
                                            <div className="col-xs-8 col-xs-offset-1">
                                                <h3>Lots</h3>
                                            </div>
                                        </div>
                                    </a>
                                    <div
                                      id="collapseLots"
                                      className="panel-collapse collapse row"
                                      role="tabpanel"
                                      aria-labelledby="#headingLots"
                                    >
                                        <div className="panel-body">
                                            <div className="col-xs-12">
                                                {subdivisionLots}
                                            </div>
                                        </div>
                                    </div>
                                </div> : <div className="row section-heading" role="tab" id="headingAccountPlats">
                                    <h3>Lots - None</h3>
                                </div>
                            }
                        </div>
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
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        subdivisions: state.subdivisions,
        plats: state.plats,
        lots: state.lots,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedSubdivision = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(getSubdivisionID(selectedSubdivision));
            dispatch(getSubdivisionPlats(selectedSubdivision));
            dispatch(getLots());
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(SubdivisionSummary);
