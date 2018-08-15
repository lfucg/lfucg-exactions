import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import Pagination from './Pagination';

class PlatsMiniSummary extends React.Component {
    render() {
        const {
            currentUser,
        } = this.props;

        const platsList = this.props.singlePlat ?
            (<div>
                <div className="row link-row">
                    <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                        <div className="col-xs-5">
                            {currentUser && currentUser.permissions && currentUser.permissions.plat &&
                                <Link to={`plat/form/${this.props.mapSet.id}`} aria-label={`Edit ${this.props.mapSet.id}`}>
                                    <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                    <div className="col-xs-7 link-label">
                                        Edit
                                    </div>
                                </Link>
                            }
                        </div>
                        <div className="col-xs-5 ">
                            <Link to={`plat/summary/${this.props.mapSet.id}`} aria-label={`${this.props.mapSet.id} Summary`}>
                                <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                <div className="col-xs-7 link-label">
                                    Summary
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-xs-12">
                    <h3 className="col-xs-12">Plat: {this.props.mapSet.cabinet}-{this.props.mapSet.slide}</h3>
                    <p className="col-xs-6">Expansion Area: {this.props.mapSet.expansion_area}</p>
                    <p className="col-xs-6">Gross Acreage: {this.props.mapSet.cleaned_total_acreage}</p>
                    <p className="col-xs-6">Buildable Lots: {this.props.mapSet.buildable_lots}</p>
                    <p className="col-xs-6">Non-Buildable Lots: {this.props.mapSet.non_buildable_lots}</p>
                    <p className="col-sm-6 col-xs-12">Sewer Exactions: {this.props.mapSet.current_sewer_due}</p>
                    <p className="col-sm-6 col-xs-12">Non-Sewer Exactions: {this.props.mapSet.current_non_sewer_due}</p>
                </div>
            </div>) : (
                this.props.mapQualifier && map((plat) => {
                    const cabinet = plat.cabinet ? `${plat.cabinet}-` : '';
                    const slide = plat.slide ? plat.slide : plat.name;
                    return (
                        <div key={plat.id} className="col-xs-12">
                            <div className="row form-subheading">
                                <h3>{cabinet}{slide}</h3>
                            </div>
                            <div className="row link-row">
                                <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                                    <div className="col-xs-5">
                                        {currentUser && currentUser.permissions && currentUser.permissions.plat &&
                                            <Link to={`plat/form/${plat.id}`} aria-label={`Edit ${plat.cabinet} ${plat.slide}`}>
                                                <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                <div className="col-xs-7 link-label">
                                                    Edit
                                                </div>
                                            </Link>
                                        }
                                    </div>
                                    <div className="col-xs-5 ">
                                        <Link to={`plat/summary/${plat.id}`} aria-label={`${plat.cabinet} ${plat.slide} Summary`}>
                                            <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                            <div className="col-xs-7 link-label">
                                                Summary
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <p className="col-xs-12"><strong>{plat.is_approved ? 'Approved' : 'Not Approved'}</strong></p>
                                <p className="col-sm-6 col-xs-12">Sewer Exactions: {plat.current_sewer_due}</p>
                                <p className="col-sm-6 col-xs-12">Non-Sewer Exactions: {plat.current_non_sewer_due}</p>
                                <p className="col-xs-6">Gross Acreage: {plat.cleaned_total_acreage}</p>
                                <p className="col-xs-6">Expansion Area: {plat.expansion_area}</p>
                            </div>
                        </div>
                    );
                })(this.props.mapSet)
            )
        ;

        return (
            <div className="existing-page-links">
                {platsList ? (
                    <div>
                        <a
                          role="button"
                          data-toggle="collapse"
                          data-parent="#accordion"
                          href="#collapseAccountPlats"
                          aria-expanded="false"
                          aria-controls="collapseAccountPlats"
                        >
                            <div className="row section-heading" role="tab" id="headingAccountPlats">
                                <div className="col-xs-1 caret-indicator" />
                                <div className="col-xs-10">
                                    {!this.props.singlePlat ?
                                        <h3>Plats</h3> :
                                        <h3>Plat Information</h3>
                                    }
                                </div>
                            </div>
                        </a>
                        <div
                          id="collapseAccountPlats"
                          className="panel-collapse collapse row"
                          role="tabpanel"
                          aria-labelledby="#headingAccountPlats"
                        >
                            <div className="panel-body">
                                {platsList}
                                {platsList ? <Pagination /> : <h1>No Results Found</h1>}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="row section-heading" role="tab" id="headingAccountPlats">
                        <h3 tabIndex="0">Plats - None</h3>
                    </div>
                )}
            </div>
        );
    }
}

PlatsMiniSummary.propTypes = {
    currentUser: PropTypes.object,
    mapSet: PropTypes.object,
    mapQualifier: PropTypes.object,
    singlePlat: PropTypes.bool,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
    };
}

export default connect(mapStateToProps)(PlatsMiniSummary);
