import React from 'react';
import { connect } from 'react-redux';
import {
    hashHistory,
} from 'react-router';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';

import FormGroup from './FormGroup';
import Breadcrumbs from './Breadcrumbs';
import Uploads from './Uploads';

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
            subdivisions,
            onSubmit,
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
                            <form onSubmit={onSubmit} >

                                <fieldset>
                                    <div className="row">
                                        <FormGroup label="* Subdivision Name" id="name" aria-required="true">
                                            <input type="text" className="form-control" placeholder="Subdivision Name" autoFocus />
                                        </FormGroup>
                                    </div>
                                    <div className="row">
                                        <FormGroup label="* Gross Acreage" id="gross_acreage" aria-required="true">
                                            <input type="text" className="form-control" placeholder="Gross Acreage" />
                                        </FormGroup>
                                    </div>
                                </fieldset>
                                <button disabled={!submitEnabled} className="btn btn-lex">Submit</button>
                                {!submitEnabled ? (
                                    <div>
                                        <div className="clearfix" />
                                        <span> * All required fields must be filled.</span>
                                    </div>
                                ) : null
                                }
                            </form>
                        </div>
                        {activeForm.sub_id &&
                            <div className="row">
                                <h1>UPLOADS</h1>
                                <Uploads file_content_type="plats,subdivision" file_object_id={activeForm.sub_id} />
                            </div>
                        }
                    </div>
                </div>

                <Footer />
            </div>
        );
    }
}

SubdivisionForm.propTypes = {
    activeForm: PropTypes.object,
    subdivisions: PropTypes.object,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
    onSubmit: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        activeForm: state.activeForm,
        subdivisions: state.subdivisions,
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
                dispatch(putSubdivision(selectedSubdivision));
            } else {
                dispatch(postSubdivision())
                .then((data_sub_post) => {
                    hashHistory.push(`subdivision/form/${data_sub_post.response.id}`);
                });
            }
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SubdivisionForm);

