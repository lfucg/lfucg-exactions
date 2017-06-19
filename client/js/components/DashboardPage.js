import React from 'react';
import { connect } from 'react-redux';

import Navbar from './Navbar';
import Footer from './Footer';

import Login from './Login';

import {
    getMe,
} from '../actions/apiActions';

class DashboardPage extends React.Component {
    static propTypes = {
        meme: React.PropTypes.func,
    };

    componentDidMount() {
    }

    render() {
        const {
            meme,
        } = this.props;

        return (
            <div className="dashboard">
                <Navbar />
                <img src={`${global.BASE_STATIC_URL}/lexington-hero-interior.jpg`} role="presentation" className="lex-banner" />
                <div className="container">
                    Hello World ... Now from React/Redux!
                    <button onClick={meme}>Get Me</button>
                    <Login />
                </div>
                <Footer />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {
        meme() {
            dispatch(getMe());
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);

