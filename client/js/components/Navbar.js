import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

class Navbar extends React.Component {

    render() {
        return (
            <div className="react-navbar">
                <header>
                    <div className="container">
                        <div className="navbar-header">
                            <Link to="dashboard/" className="navbar-brand" aria-label="Exactions Home" />
                            <button className="btn navbar-btn navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
                                <span className="icon-bar" />
                                <span className="icon-bar" />
                                <span className="icon-bar" />
                            </button>
                        </div>
                        <div id="navbar-header-collapse" className="collapse navbar-collapse">
                            <div className="pull-right">
                                <ul className="nav navbar-nav pull-right navbar-menu">
                                    <li>
                                        <Link to="dashboard/" className="btn" >Home</Link>
                                    </li>
                                    <li>Finance</li>
                                    <li>Plats</li>
                                    <li>Lots</li>
                                    <li>Payments</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </header>
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


export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
