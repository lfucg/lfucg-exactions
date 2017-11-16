import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class LoadingScreen extends React.Component {
    componentDidMount() {

    }

    render() {
        return (
            <div className="row text-center">
                <h5 className="sr-only">Loading...</h5>
                <i className="fa fa-spinner fa-pulse fa-3x fa-fw" />
            </div>
        );
    }
}

LoadingScreen.propTypes = {

};

function mapStateToProps(state) {
    return {
        activeForm: state.activeForm,
    };
}

function mapDispatchToProps() {
    return {
        onComponentDidMount() {

        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen);
