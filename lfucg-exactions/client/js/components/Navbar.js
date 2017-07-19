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

        const windowWidth = window.innerWidth;

        // const divStyle = {
        //     height: 100,
        // };
        return (
            <div className="react-navbar">
                <header>
                    <div className="container">
                        <div className="navbar-header">
                            {windowWidth <= 767 ?
                                <Link to="dashboard/" aria-label="Exactions Home" role="link" >
                                    <img className="navbar-brand" src={`${global.BASE_STATIC_URL}/Lexington_Web_Color_Horse_Only.png`} alt="#" aria-hidden />
                                </Link>
                            :
                                <Link to="dashboard/" aria-label="Exactions Home" role="link" >
                                    <img className="navbar-brand"  src={`${global.BASE_STATIC_URL}/lexington-logo.svg`} alt="#" aria-hidden />
                                </Link>
                            }
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
                                    {console.log('WIDTH', window.innerWidth)}
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
