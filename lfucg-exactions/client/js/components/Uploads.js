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
                        <h5>
                            <div className="col-sm-3">
                                {single_upload.date}
                            </div>
                            <div className="col-sm-8">
                                <a href={single_upload.upload} >
                                    {single_upload.upload}
                                </a>
                            </div>
                        </h5>
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
                                <input
                                  type="file"
                                  accept="file_extention|image/*"
                                  className="form-control"
                                  placeholder="Upload files"
                                />
                            </FormGroup>
                        </div>
                        <div className="col-sm-3">
                            <button className="btn btn-lex" Upload >
                                Upload
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
                console.log('UPLOADED');
                // dispatch(getUploadContent());
            });
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Uploads);
