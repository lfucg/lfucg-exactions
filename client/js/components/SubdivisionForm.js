import React from 'react';
import { connect } from 'react-redux';
import {
    Link,
    hashHistory,
} from 'react-router';

import Navbar from './Navbar';
import Footer from './Footer';

import FormGroup from './FormGroup';

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
    static propTypes = {
        activeForm: React.PropTypes.object,
        subdivisions: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
        onSubmit: React.PropTypes.func,
    };

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
                        <div className="col-sm-9">
                            <h1>SUBDIVISIONS - CREATE / APPLY</h1>
                        </div>
                        <div className="col-sm-3">
                            <Link to="subdivision" className="btn btn-lex-reverse" role="link">Return to Subdivisions</Link>
                        </div>
                    </div>
                </div>
                <div className="inside-body">
                    <div className="container">
                        <div className="col-sm-offset-1 col-sm-10">
                            <form onSubmit={onSubmit} >

                                <fieldset>
                                    <div className="row">
                                        <FormGroup label="* Subdivision Name" id="name">
                                            <input type="text" className="form-control" placeholder="Subdivision Name" autoFocus />
                                        </FormGroup>
                                    </div>
                                    <div className="row">
                                        <FormGroup label="* Gross Acreage" id="gross_acreage">
                                            <input type="text" className="form-control" placeholder="Gross Acreage" />
                                        </FormGroup>
                                    </div>
                                    <div className="row">
                                        <FormGroup label="* Number of Allowed Lots" id="number_allowed_lots">
                                            <input type="text" className="form-control" placeholder="Number of Allowed Lots" />
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
                    </div>
                </div>

                <Footer />
            </div>
        );
    }
}

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
            dispatch(getSubdivisionID(selectedSubdivision))
            .then((data_subdivision) => {
                const update = {
                    name: data_subdivision.response.name,
                    gross_acreage: data_subdivision.response.cleaned_gross_acreage,
                    number_allowed_lots: data_subdivision.response.number_allowed_lots,
                };
                dispatch(formUpdate(update));
            });
        },
        onSubmit(event) {
            event.preventDefault();
            dispatch(postSubdivision())
            .then(() => {
                hashHistory.push('subdivision/existing/');
            });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SubdivisionForm);

