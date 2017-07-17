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

    render() {
        const {
        } = this.props;

        return (
            <div className="dashboard">
                <Navbar />

                <img src={`${global.BASE_STATIC_URL}/images/lexington-hero-interior.jpg`} role="presentation" className="lex-banner" />
                <div className="inside-body">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-4 col-sm-6">
                                <Link to="subdivision/" role="link"><h2 className="in-page-link">Subdivisions</h2></Link>
                                <p>Lexington subdivisions.</p>
                            </div>
                            <div className="col-md-4 col-sm-6">
                                <Link to="plat" role="link"><h2 className="in-page-link">Plats</h2></Link>
                                <p>Lexington plats.</p>
                            </div>
                            <div className="col-md-4 col-sm-6">
                                <Link to="lot" role="link"><h2 className="in-page-link">Lots</h2></Link>
                                <p>Lexington lots.</p>
                            </div>
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

