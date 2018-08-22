import React from 'react';
import { connect } from 'react-redux';
import {
    hashHistory,
} from 'react-router';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';

import Notes from './Notes';
import FormGroup from './FormGroup';
import Breadcrumbs from './Breadcrumbs';
import DeclineDelete from './DeclineDelete';

import {
    formInit,
    formUpdate,
} from '../actions/formActions';


import {
    getSubdivisionID,
    postSubdivision,
    putSubdivision,
} from '../actions/apiActions';

class SubdivisionForm extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            activeForm,
            onSubmit,
            selectedSubdivision,
            subdivisions,
        } = this.props;

        const submitEnabled =
            activeForm.name &&
            activeForm.gross_acreage;

        return (
            <div className="subdivision-form">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>SUBDIVISIONS - CREATE / APPLY</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'subdivision'} parent_name={'Subdivisions'} />

                <div className="inside-body">
                    <div className="container">
                        <div className="col-sm-offset-1 col-sm-10">
                            <form >
                                <fieldset>
                                    <div className="row">
                                        <FormGroup label="* Subdivision Name" id="name" ariaRequired="true">
                                            <input type="text" className="form-control" placeholder="Subdivision Name" autoFocus />
                                        </FormGroup>
                                    </div>
                                    <div className="row">
                                        <FormGroup label="* Gross Acreage" id="gross_acreage" ariaRequired="true">
                                            <input type="text" className="form-control" placeholder="Gross Acreage" />
                                        </FormGroup>
                                    </div>
                                </fieldset>
                                <div className="col-xs-8">
                                    <button disabled={!submitEnabled} className="btn btn-lex" onClick={onSubmit} >Submit</button>
                                    {!submitEnabled ? (
                                        <div>
                                            <div className="clearfix" />
                                            <span> * All required fields must be filled.</span>
                                        </div>
                                    ) : null
                                    }
                                </div>
                                <div className="col-xs-4">
                                    <DeclineDelete currentForm="/subdivision/" selectedEntry={selectedSubdivision} parentRoute="subdivision" />
                                </div>
                            </form>
                            <div className="clearfix" />
                            <hr aria-hidden="true" />
                            {selectedSubdivision &&
                                <Notes
                                  content_type="plats_subdivision"
                                  object_id={selectedSubdivision}
                                  ariaExpanded="true"
                                  panelClass="panel-collapse collapse row in"
                                  permission="subdivision"
                                />
                            }
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        );
    }
}

SubdivisionForm.propTypes = {
    activeForm: PropTypes.object,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
    onSubmit: PropTypes.func,
    selectedSubdivision: PropTypes.string,
    subdivisions: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        activeForm: state.activeForm,
        subdivisions: state.subdivisions && state.subdivisions.currentSubdivision,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedSubdivision = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(formInit());
            if (selectedSubdivision) {
                dispatch(getSubdivisionID(selectedSubdivision))
                .then((data_subdivision) => {
                    const update = {
                        sub_id: selectedSubdivision,
                        name: data_subdivision.response.name,
                        gross_acreage: data_subdivision.response.cleaned_gross_acreage,
                    };
                    dispatch(formUpdate(update));
                });
            }
        },
        onSubmit(event) {
            event.preventDefault();
            if (selectedSubdivision) {
                dispatch(putSubdivision(selectedSubdivision))
                    .then((data) => {
                        if (data.response) {
                            hashHistory.push(`subdivision/summary/${selectedSubdivision}`);
                        }
                    });
            } else {
                dispatch(postSubdivision())
                .then((data_sub_post) => {
                    if (data_sub_post.response) {
                        hashHistory.push(`subdivision/summary/${data_sub_post.response.id}`);
                    }
                });
            }
        },
        selectedSubdivision,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SubdivisionForm);

