import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    postDelete,
} from '../actions/apiActions';

class DeclineDelete extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount({
            currentForm: this.props.currentForm,
            selectedEntry: this.props.selectedEntry,
        });
    }

    render() {
        const {
            currentUser,
            onDelete,
            selectedEntry,
        } = this.props;

        return (
            <div className="decline-delete">
                {currentUser && (currentUser.is_superuser || (currentUser.profile && currentUser.profile.is_supervisor)) &&
                    <button className="btn btn-danger btn-lex-danger" onClick={onDelete}>
                        Decline / Delete
                    </button>
                }
                {console.log('SELECTED ENTRY', selectedEntry)}
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
            dispatch(postDelete(props.currentForm, props.selectedEntry));
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(DeclineDelete);
