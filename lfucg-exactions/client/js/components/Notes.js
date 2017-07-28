import React from 'react';
import { Router, Route, hashHistory, Redirect, refresh } from 'react-router';
import { connect } from 'react-redux';
import { map } from 'ramda';

import FormGroup from './FormGroup';

import {
    getNoteContent,
    postNote,
} from '../actions/apiActions';

import {
    formUpdate,
} from '../actions/formActions';

class Notes extends React.Component {
    static propTypes = {
        notes: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
        onSubmit: React.PropTypes.func,
    };

    componentDidMount() {
        this.props.onComponentDidMount();
    }


    render() {
        const {
            notes,
            onSubmit,
        } = this.props;

        return (
            <div className="container">
                <form onSubmit={onSubmit} >
                    <fieldset>
                        <div className="row">
                            <FormGroup label="Add Notes" id="note">
                                <textarea type="text" className="form-control" placeholder="Add Notes" rows="5" />
                            </FormGroup>
                        </div>
                        <div className="col-sm-3">
                            <button className="btn btn-lex">
                                Add Note
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        notes: state.notes,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(getNoteContent())
            .then((note_data) => {
                console.log('NOTE DATA', note_data);
            });
        },
        onSubmit() {
            dispatch(postNote());
            console.log('POST NOTE');
            // const current_location = hashHistory.getCurrentLocation();
            // hashHistory.replace(current_location);
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Notes);
