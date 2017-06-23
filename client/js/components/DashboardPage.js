import React from 'react';
import { connect } from 'react-redux';

import Navbar from './Navbar';
import Footer from './Footer';

class DashboardPage extends React.Component {
    static propTypes = {
    };

    render() {
        const {
        } = this.props;

        return (
            <div className="dashboard">
                <Navbar />
                <img src={`${global.BASE_STATIC_URL}/images/lexington-hero-interior.jpg`} role="presentation" className="lex-banner" />
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
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);

