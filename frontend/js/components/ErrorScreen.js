import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class ErrorScreen extends React.Component {
    componentDidMount() {

    }

    render() {
        const {
            error,
        } = this.props;

        return (
            <div className="row text-center error">
                <h1>Error</h1>
                <p>There was an error getting or submitting data. Please share this error message with your system administrator:</p>
                <div>
                    <p>{error}</p>
                </div>
            </div>
        );
    }
}

ErrorScreen.propTypes = {
    error: PropTypes.string,
};

function mapStateToProps(state) {
    return {
        errorPayment: state.errorPayment,
    };
}

function mapDispatchToProps() {
    return {
        onComponentDidMount() {

        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(ErrorScreen);
