import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    hashHistory,
} from 'react-router';

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
                {currentUser && (currentUser.is_superuser || (currentUser.profile && currentUser.profile.is_supervisor)) &&
                    <button className="btn btn-danger btn-lex-danger" onClick={onDelete}>
                        Decline / Delete
                    </button>
                }
            </div>
        );
    }
}

DeclineDelete.propTypes = {
    currentUser: PropTypes.object,
    onComponentDidMount: PropTypes.func,
    onDelete: PropTypes.func,
    currentForm: PropTypes.string,
    selectedEntry: PropTypes.string,
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
