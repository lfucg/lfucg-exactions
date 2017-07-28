import React from 'react';
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
        activeForm: React.PropTypes.object,
        notes: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
        onSubmit: React.PropTypes.func,
        content_type: React.PropTypes.string,
        object_id: React.PropTypes.number,
    };

    componentDidMount() {
        this.props.onComponentDidMount({
            content_type: this.props.content_type,
            object_id: this.props.object_id,
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
                                    {single_note.cleaned_date}
                                </div>
                                <div className="col-sm-6">
                                    {single_note.content_type_title}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    {single_note.user_name}
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

                dispatch(formUpdate(update_content));
                dispatch(getNoteContent());
            }
        },
        onSubmit() {
            dispatch(postNote());
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Notes);
