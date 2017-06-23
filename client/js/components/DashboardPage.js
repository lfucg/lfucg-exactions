import React from 'react';
import { connect } from 'react-redux';
import {
    Link,
} from 'react-router';

import Navbar from './Navbar';
import Footer from './Footer';

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
                    <div className="row">
                        <div className="col-md-4 col-sm-6">
                            <Link to="subdivision-page"><h3>Subdivisions</h3></Link>
                            <p>Lexington subdivisions.</p>
                        </div>
                        <div className="col-md-4 col-sm-6">
                            <Link to="plat-page"><h3>Plats</h3></Link>
                            <p>Lexington plats.</p>
                        </div>
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

