import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import {
    formUpdate,
} from '../actions/formActions';

import {
    getSubdivisionID,
    getSubdivisionPlats,
    getSubdivisionLots,
} from '../actions/apiActions';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Notes from './Notes';
import LoadingScreen from './LoadingScreen';

import PlatsMiniSummary from './PlatsMiniSummary';
import LotsMiniSummary from './LotsMiniSummary';


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

        let subdivision_acreage_used = 0;
        
        return (
            <div className="subdivision-summary">
                {!!subdivisions && !!subdivisions.currentSubdivision && <div>
                    <Navbar />

                    <div className="form-header">
                        <div className="container">
                            <h1>SUBDIVISION SUMMARY - {subdivisions.currentSubdivision.name}</h1>
                        </div>
                    </div>

                    <Breadcrumbs route={this.props.route} parent_link={'subdivision'} parent_name={'Subdivisions'} />
                    
                    <div className="inside-body">
                        <div className="container">
                            {subdivisions.loadingSubdivision ? <LoadingScreen /> :
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
                                                            <Link to={`subdivision/form/${subdivisions.currentSubdivision.id}`} aria-label={`Edit ${subdivisions.currentSubdivision.name}`}>
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
                                            <p className="col-xs-6">Subdivision Name: {subdivisions.currentSubdivision.name}</p>
                                            <p className="col-xs-6">Gross Acreage: {subdivisions.currentSubdivision.cleaned_gross_acreage}</p>
                                            <p className="col-xs-6">Acreage Used: {subdivision_acreage_used}</p>
                                            <p className="col-xs-6">Acreage Available: {subdivisions.currentSubdivision.cleaned_gross_acreage - subdivision_acreage_used}</p>
                                        </div>
                                    </div>
                                    {subdivisions && subdivisions.currentSubdivision.id &&
                                        <Notes
                                        content_type="plats_subdivision"
                                        object_id={subdivisions.currentSubdivision.id}
                                        ariaExpanded="false"
                                        panelClass="panel-collapse collapse row"
                                        permission="subdivision"
                                        />
                                    }

                                    <PlatsMiniSummary
                                        mapSet={plats && plats.plats}
                                        mapQualifier={plats && plats.plats && plats.plats.length > 0}
                                        plats={plats}
                                    />

                                    <LotsMiniSummary
                                        mapSet={lots.lots}
                                        mapQualifier={lots && lots.lots && lots.lots.length > 0}
                                        lots={lots}
                                    />

                                </div>
                            )}
                        </div>
                    </div>
                <Footer />
                </div>
                }
            </div>
        );
    }
}

SubdivisionSummary.propTypes = {
    currentUser: PropTypes.object,
    subdivisions: PropTypes.object,
    plats: PropTypes.object,
    lots: PropTypes.object,
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
            dispatch(getSubdivisionPlats(selectedSubdivision))
            .then((plat) => {
                dispatch(formUpdate({
                    prev: plat.response.previous,
                    next: plat.response.next, 
                }))
            });
            dispatch(getSubdivisionLots(selectedSubdivision))
            .then(() => {
                dispatch(formUpdate({ loading: false }));
            });
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(SubdivisionSummary);
