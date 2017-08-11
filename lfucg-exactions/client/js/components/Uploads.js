import React from 'react';
import { connect } from 'react-redux';
import { map } from 'ramda';

import FormGroup from './FormGroup';

import {
    getUploadContent,
    postUpload,
} from '../actions/apiActions';

import {
    formUpdate,
} from '../actions/formActions';

class Uploads extends React.Component {
    static propTypes = {
        activeForm: React.PropTypes.object,
        uploads: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
        onSubmit: React.PropTypes.func,
        file_content_type: React.PropTypes.string,
        file_object_id: React.PropTypes.number,
    };

    componentDidMount() {
        this.props.onComponentDidMount({
            file_content_type: this.props.file_content_type,
            file_object_id: this.props.file_object_id,
        });
    }


    render() {
        const {
            activeForm,
            uploads,
            onSubmit,
        } = this.props;

        const uploadsList = uploads.length > 0 && (map((single_upload) => {
            return (
                <div key={single_upload.id} >
                    <div className="row">
                        <div className="col-sm-3">
                            <div className="row">
                                <div className="col-sm-6">
                                    {single_upload.date}
                                </div>
                                <div className="col-sm-6">
                                    on {single_upload.file_content_type}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    {single_upload.user}
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-8">
                            <h5>
                                {single_upload.upload}
                            </h5>
                        </div>
                    </div>
                    <hr aria-hidden="true" />
                </div>
            );
        })(uploads));

        return (
            <div className="container uploads-page">
                <div className="row">
                    <h2>Existing Uploads</h2>
                </div>
                <div className="row">
                    <h4>
                        <div className="col-sm-3">Information</div>
                        <div className="col-sm-8">Uploads</div>
                    </h4>
                </div>
                <div className="row existing-uploads">
                    {uploadsList}
                </div>
                <form onSubmit={onSubmit} >
                    <fieldset>
                        <div className="row">
                            <FormGroup label="Add Uploads" id="upload">
                                <textarea type="text" className="form-control" placeholder="Add Uploads" rows="5" />
                            </FormGroup>
                        </div>
                        <div className="col-sm-3">
                            <button className="btn btn-lex">
                                Add Upload
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
        uploads: state.uploads,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount(pass_props) {
            if (pass_props.file_content_type) {
                const update_content = {};

                update_content.file_content_type = pass_props.file_content_type;
                update_content.file_object_id = pass_props.file_object_id;

                dispatch(formUpdate(update_content));
                dispatch(getUploadContent());
            }
        },
        onSubmit() {
            dispatch(postUpload())
            .then(() => {
                dispatch(getUploadContent());
            });
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Uploads);
