import React from 'react';
import { connect } from 'react-redux';

import Navbar from './Navbar';
import Footer from './Footer';

import {
    getMe,
} from '../actions/apiActions';

class DashboardPage extends React.Component {
    static propTypes = {
        currentUser: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
    };

    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            currentUser,
        } = this.props;

        return (
            <div className="dashboard">
                <Navbar />
                <img src={`${global.BASE_STATIC_URL}/lexington-hero-interior.jpg`} role="presentation" className="lex-banner" />
                <div className="container">
                    Hello World ... Now from React/Redux!
                </div>
                <Footer />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(getMe());
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);

