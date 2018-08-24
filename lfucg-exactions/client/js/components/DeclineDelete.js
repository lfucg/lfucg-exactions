import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { hashHistory } from 'react-router';

import {
    postDelete,
} from '../actions/apiActions';

class DeclineDelete extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount({
            currentForm: this.props.currentForm,
            selectedEntry: this.props.selectedEntry,
            parentRoute: this.props.parentRoute,
        });
    }

    render() {
        const {
            currentUser,
            onDelete,
        } = this.props;

        return (
            <div className="decline-delete">
                {currentUser && (currentUser.is_superuser || (currentUser.profile && currentUser.profile.is_supervisor)) && this.props.selectedEntry &&
                    <button className="btn btn-danger btn-lex-danger" data-toggle="modal" data-target="#deleteConfirm">
                        Decline / Delete
                    </button>
                }
                <div id="deleteConfirm" className="modal fade" role="alertdialog" aria-labelledby="modalTitle">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" autoFocus aria-label="Confirm deletion">&times;</button>
                                <h4 id="modalTitle" tabIndex="0">Delete Confirmation</h4>
                            </div>
                            <div className="modal-body" tabIndex="0">
                                Please confirm the deletion of this entry.
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-lex" data-dismiss="modal">Cancel</button>
                                <button onClick={onDelete} className="btn btn-danger btn-lex-danger">Confirm Deletion</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

DeclineDelete.propTypes = {
    currentUser: PropTypes.object,
    onComponentDidMount: PropTypes.func,
    onDelete: PropTypes.func,
    currentForm: PropTypes.string,
    selectedEntry: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    parentRoute: PropTypes.string,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
    };
}

function mapDispatchToProps(dispatch, props) {
    return {
        onComponentDidMount() {
        },
        onDelete() {
            dispatch(postDelete(props.currentForm, props.selectedEntry))
            .then(() => {
                hashHistory.push(props.parentRoute);
            });
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(DeclineDelete);
