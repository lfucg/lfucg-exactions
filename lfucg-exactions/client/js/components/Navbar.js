import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import PropTypes from 'prop-types';

import {
    logout,
    getMe,
} from '../actions/apiActions';

class Navbar extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            currentUser,
            onLogout,
        } = this.props;

        const windowWidth = window.innerWidth;

        return (
            <div className="react-navbar">
                <header>
                    <div className="container">
                        <div className="navbar-header">
                            {windowWidth <= 767 ?
                                <Link to="dashboard/" aria-label="Exactions Home" role="link" >
                                    <img className="navbar-brand" src={`${window.StaticURL}images/Lexington_Web_Color_Horse_Only.png`} alt="#" aria-hidden />
                                </Link>
                            :
                                <Link to="dashboard/" aria-label="Exactions Home" role="link" >
                                    <img className="navbar-brand" src={`${window.StaticURL}images/lexington-logo.svg`} alt="#" aria-hidden />
                                </Link>
                            }
                            <button className="btn navbar-btn navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
                                <span className="icon-bar" />
                                <span className="icon-bar" />
                                <span className="icon-bar" />
                            </button>
                        </div>
                        <div id="navbar-header-collapse" className="text-center collapse navbar-collapse">
                            <div className="pull-right">
                                <ul className="nav navbar-nav pull-right navbar-menu">
                                    <li>
                                        <Link to="dashboard/" role="link" >Home</Link>
                                    </li>
                                    { currentUser.username ? (
                                        <li>
                                            <button className="navbar-button" role="link" onClick={onLogout} >
                                                Logout
                                            </button>
                                        </li>
                                    ) : (
                                        <li>
                                            <Link to="login/" role="link" >Login</Link>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="clearfix" />
            </div>
        );
    }
}

Navbar.propTypes = {
    currentUser: PropTypes.object,
    onComponentDidMount: PropTypes.func,
    onLogout: PropTypes.func,
};

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
        onLogout() {
            dispatch(logout());
            hashHistory.push('login/');
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
