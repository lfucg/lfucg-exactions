import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { map } from 'ramda';
import PropTypes from 'prop-types';

class LotsMiniSummary extends React.Component {
    render() {
        const {
            currentUser,
        } = this.props;

        const lotsList = this.props.mapQualifier && this.props.singleLot ?
            (<div>
                <div className="row link-row">
                    <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                        <div className="col-xs-5">
                            {currentUser && currentUser.permissions && currentUser.permissions.lot &&
                                <Link to={`lot/form/${this.props.mapSet.id}`} aria-label={`Edit ${this.props.mapSet.address_full}`}>
                                    <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                    <div className="col-xs-7 link-label">
                                        Edit
                                    </div>
                                </Link>
                            }
                        </div>
                        <div className="col-xs-5 ">
                            <Link to={`lot/summary/${this.props.mapSet.id}`} aria-label={`${this.props.mapSet.address_full} Summary`}>
                                <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                <div className="col-xs-7 link-label">
                                    Summary
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-xs-12">
                    <p className="col-xs-12">Lot Address: {this.props.mapSet.address_full}</p>
                    <p className="col-xs-6">Current Exactions: {this.props.mapSet && this.props.mapSet.lot_exactions && this.props.mapSet.lot_exactions.current_exactions}</p>
                    <p className="col-xs-6">Plat: {this.props.mapSet.plat.cabinet}-{this.props.mapSet.plat.slide}</p>
                    <p className="col-xs-6 ">Lot Number: {this.props.mapSet.lot_number}</p>
                    <p className="col-xs-6">Permit ID: {this.props.mapSet.permit_id}</p>
                </div>
            </div>) : (
                this.props.mapQualifier && map((lot) => {
                    return (
                        <div key={lot.id} className="col-xs-12">
                            <div className="row form-subheading">
                                <h3>{lot.address_full}</h3>
                            </div>
                            <div className="row link-row">
                                <div className="col-xs-12 col-sm-5 col-sm-offset-7">
                                    <div className="col-xs-5">
                                        {currentUser && currentUser.permissions && currentUser.permissions.lot &&
                                            <Link to={`lot/form/${lot.id}`} aria-label={`Edit ${lot.address_full}`}>
                                                <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                                <div className="col-xs-7 link-label">
                                                    Edit
                                                </div>
                                            </Link>
                                        }
                                    </div>
                                    <div className="col-xs-5 ">
                                        <Link to={`lot/summary/${lot.id}`} aria-label={`${lot.address_full} Summary`}>
                                            <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                            <div className="col-xs-7 link-label">
                                                Summary
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <p className="col-xs-6">Current Exactions: {lot.lot_exactions && lot.lot_exactions.current_exactions}</p>
                                <p className="col-xs-6"><strong>{lot.is_approved ? 'Approved' : 'Not Approved'}</strong></p>
                                <p className="col-xs-6">Lot Number: {lot.lot_number}</p>
                                <p className="col-xs-6">Parcel ID: {lot.parcel_id}</p>
                            </div>
                        </div>
                    );
                })(this.props.mapSet)
            )
        ;

        return (
            <div className="existing-page-links">
                {lotsList ? (
                    <div>
                        <a
                          role="button"
                          data-toggle="collapse"
                          data-parent="#accordion"
                          href="#collapseAccountLots"
                          aria-expanded="false"
                          aria-controls="collapseAccountLots"
                        >
                            <div className="row section-heading" role="tab" id="headingAccountLots">
                                <div className="col-xs-1 caret-indicator" />
                                <div className="col-xs-10">
                                    {!this.props.singleLot ?
                                        <h3>Lots</h3> :
                                        <h3>Lot Information</h3>
                                    }
                                </div>
                            </div>
                        </a>
                        <div
                          id="collapseAccountLots"
                          className="panel-collapse collapse row"
                          role="tabpanel"
                          aria-labelledby="#headingAccountLots"
                        >
                            <div className="panel-body">
                                {lotsList}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="row section-heading" role="tab" id="headingAccountLots">
                        <h3 tabIndex="0">Lots - None</h3>
                    </div>
                )}
            </div>
        );
    }
}

LotsMiniSummary.propTypes = {
    currentUser: PropTypes.object,
    mapSet: PropTypes.object,
    mapQualifier: PropTypes.object,
    singleLot: PropTypes.bool,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
    };
}

export default connect(mapStateToProps)(LotsMiniSummary);
