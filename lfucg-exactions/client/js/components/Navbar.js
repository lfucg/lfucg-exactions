import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import {
    logout,
    getMe,
} from '../actions/apiActions';

class Navbar extends React.Component {
    static propTypes = {
        currentUser: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
        onLogout: React.PropTypes.func,
    }

    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            currentUser,
            onLogout,
        } = this.props;

        return (
            <div className="react-navbar">
                <header>
                    <div className="container">
                        <div className="navbar-header">
                            <Link to="dashboard/" className="navbar-brand" aria-label="Exactions Home" role="link" />
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
        onLogout() {
            dispatch(logout());
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
