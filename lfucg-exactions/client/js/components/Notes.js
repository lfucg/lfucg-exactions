import React from 'react';
import { connect } from 'react-redux';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import FormGroup from './FormGroup';

import {
    getNoteContent,
    postNote,
} from '../actions/apiActions';

import {
    formUpdate,
} from '../actions/formActions';

class Notes extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount({
            content_type: this.props.content_type,
            object_id: this.props.object_id,
            parent_content_type: this.props.parent_content_type,
            parent_object_id: this.props.parent_object_id,
        });
    }


    render() {
        const {
            activeForm,
            notes,
            onSubmit,
        } = this.props;

        const notesList = notes.length > 0 && (map((single_note) => {
            return (
                <div key={single_note.id} >
                    <div className="row">
                        <div className="col-sm-3">
                            <div className="row">
                                <div className="col-sm-6">
                                    {single_note.date}
                                </div>
                                <div className="col-sm-6">
                                    on {single_note.content_type}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    {single_note.user}
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-8">
                            <h5>
                                {single_note.note}
                            </h5>
                        </div>
                    </div>
                    <hr aria-hidden="true" />
                </div>
            );
        })(notes));

        return (
            <div className="container notes-page">
                <div className="row">
                    <h2>Existing Notes</h2>
                </div>
                <div className="row">
                    <h4>
                        <div className="col-sm-3">Information</div>
                        <div className="col-sm-8">Notes</div>
                    </h4>
                </div>
                <div className="row existing-notes">
                    {notesList}
                </div>
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

Notes.propTypes = {
    activeForm: PropTypes.object,
    notes: PropTypes.object,
    onComponentDidMount: PropTypes.func,
    onSubmit: PropTypes.func,
    content_type: PropTypes.string,
    object_id: PropTypes.number,
    parent_content_type: PropTypes.string,
    parent_object_id: PropTypes.number,
};

function mapStateToProps(state) {
    return {
        activeForm: state.activeForm,
        notes: state.notes,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount(pass_props) {
            if (pass_props.content_type) {
                const update_content = {};

                update_content.content_type = pass_props.content_type;
                update_content.object_id = pass_props.object_id;
                update_content.parent_content_type = pass_props.parent_content_type;
                update_content.parent_object_id = pass_props.parent_object_id;

                dispatch(formUpdate(update_content));
                dispatch(getNoteContent());
            }
        },
        onSubmit() {
            dispatch(postNote())
            .then(() => {
                const clear_note = {
                    note: '',
                };
                dispatch(formUpdate(clear_note));
                dispatch(getNoteContent());
            });
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Notes);
