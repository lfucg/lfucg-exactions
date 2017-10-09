import React from 'react';
import { connect } from 'react-redux';
import { map, contains } from 'ramda';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

import {
    getUploadContent,
    postUpload,
} from '../actions/apiActions';

import {
    formUpdate,
} from '../actions/formActions';

class Uploads extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount({
            file_content_type: this.props.file_content_type,
            file_object_id: this.props.file_object_id,
        });
    }


    render() {
        const {
            currentUser,
            activeForm,
            uploads,
            fileUploading,
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
                                    {single_upload.filename_display}
                                </a>
                            </div>
                        </h5>
                    </div>
                    <hr aria-hidden="true" />
                </div>
            );
        })(uploads));

        return (
            <div className="uploads-page">
                <div className="col-md-offset-1 col-md-10 panel-group" id="accordion" role="tablist" aria-multiselectable="false">
                    <a
                      role="button"
                      data-toggle="collapse"
                      data-parent="#accordion"
                      href="#collapseUpload"
                      aria-expanded={this.props.ariaExpanded}
                      aria-controls="collapseUpload"
                    >
                        <div className="row section-heading" role="tab" id="headingUploads">
                            <div className="col-xs-1 caret-indicator" />
                            <div className="col-xs-10">
                                <h2>Uploads</h2>
                            </div>
                        </div>
                    </a>
                    <div
                      id="collapseUpload"
                      className={this.props.panelClass}
                      role="tabpanel"
                      aria-labelledby="#headingUploads"
                    >
                        <div className="panel-body">
                            <div className="col-sm-12">
                                {uploads && uploads.length > 0 &&
                                    <div>
                                        <div className="row">
                                            <h2>Existing Uploads</h2>
                                        </div>
                                        <div className="row">
                                            <h4>
                                                <div className="col-sm-3">Date</div>
                                                <div className="col-sm-8">Uploads</div>
                                            </h4>
                                        </div>
                                        <div className="row existing-uploads">
                                            {uploadsList}
                                        </div>
                                    </div>
                                }
                                {currentUser && currentUser.permissions && contains(this.props.permission, Object.keys(currentUser.permissions)) &&
                                    <Dropzone onDrop={fileUploading} style={{}} >
                                        <button className="btn btn-lex">Add File</button>
                                    </Dropzone>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Uploads.propTypes = {
    currentUser: PropTypes.object,
    activeForm: PropTypes.object,
    uploads: PropTypes.object,
    onComponentDidMount: PropTypes.func,
    file_content_type: PropTypes.string,
    file_object_id: PropTypes.number,
    fileUploading: PropTypes.func,
    ariaExpanded: PropTypes.string,
    panelClass: PropTypes.string,
    permission: PropTypes.string,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
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
        fileUploading(files) {
            dispatch(postUpload(files))
            .then(() => {
                dispatch(getUploadContent());
            });
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Uploads);
