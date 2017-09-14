import React from 'react';
import { connect } from 'react-redux';
import {
    Link,
} from 'react-router';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';

class DashboardPage extends React.Component {
    render() {
        const {
            currentUser,
        } = this.props;
        return (
            <div className="dashboard">
                <Navbar />

                <img src={`${global.BASE_STATIC_URL}/lexington-hero-interior.jpg`} role="presentation" className="lex-banner" />
                <div className="inside-body">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-4 col-sm-6">
                                <Link to="subdivision" role="link"><h2 className="in-page-link">Subdivisions</h2></Link>
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
                            <div className="col-md-4 col-sm-6">
                                <Link to="account" role="link"><h2 className="in-page-link">Developers / Accounts</h2></Link>
                                <p>Developers and associated accounts.</p>
                            </div>
                            <div className="col-md-4 col-sm-6">
                                <Link to="agreement" role="link"><h2 className="in-page-link">Agreements</h2></Link>
                                <p>Lexington agreements.</p>
                            </div>
                            <div className="col-md-4 col-sm-6">
                                <Link to="payment" role="link"><h2 className="in-page-link">Payments</h2></Link>
                                <p>Lexington payments.</p>
                            </div>
                            <div className="col-md-4 col-sm-6">
                                <Link to="project" role="link"><h2 className="in-page-link">Projects</h2></Link>
                                <p>Lexington projects.</p>
                            </div>
                            <div className="col-md-4 col-sm-6">
                                <Link to="project-cost" role="link"><h2 className="in-page-link">Project Costs</h2></Link>
                                <p>Lexington project costs.</p>
                            </div>
                            <div className="col-md-4 col-sm-6">
                                <Link to="account-ledger" role="link"><h2 className="in-page-link">Account Ledgers</h2></Link>
                                <p>Lexington account ledgers.</p>
                            </div>
                            {currentUser && currentUser.is_superuser &&
                                <div className="col-md-4 col-sm-6">
                                    <Link to="rate-table/form/" role="link"><h2 className="in-page-link">Rate Tables</h2></Link>
                                    <p>Update or create rate tables.</p>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

DashboardPage.propTypes = {
    currentUser: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
    };
}

export default connect(mapStateToProps)(DashboardPage);

