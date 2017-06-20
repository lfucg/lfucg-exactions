import React from 'react';
import { connect } from 'react-redux';

import Navbar from './Navbar';
import Footer from './Footer';

import Login from './Login';

class DashboardPage extends React.Component {
    static propTypes = {
    };

    componentDidMount() {
    }

    render() {
        const {
        } = this.props;

        return (
            <div className="dashboard">
                <Navbar />
                <img src={`${global.BASE_STATIC_URL}/lexington-hero-interior.jpg`} role="presentation" className="lex-banner" />
                <div className="container">
                    <div className="col-md-6">
                        Hello World ... Now from React/Redux!
                    </div>
                    <div className="col-md-6">
                        <Login />
                    </div>
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
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);

