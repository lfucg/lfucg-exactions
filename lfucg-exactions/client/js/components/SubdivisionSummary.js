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
