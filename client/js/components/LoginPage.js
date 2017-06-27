import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

import Navbar from './Navbar';
import Footer from './Footer';
import FormGroup from './FormGroup';

import {
    login,
    register,
    passwordReset,
    sendUsername,
} from '../actions/apiActions';

import {
    formInit,
    formUpdate,
} from '../actions/formActions';

class Login extends React.Component {
    static propTypes = {
        activeForm: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
        changeSelection: React.PropTypes.func,
        onLogin: React.PropTypes.func,
        onRegister: React.PropTypes.func,
        forgotPassword: React.PropTypes.func,
        forgotUsername: React.PropTypes.func,
    }

    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            activeForm,
            changeSelection,
            onLogin,
            onRegister,
            forgotPassword,
            forgotUsername,
        } = this.props;

        const {
            login_choice,
        } = activeForm;

        return (
            <div className="login">
                <Navbar />
                <img src={`${global.BASE_STATIC_URL}/images/lexington-hero-interior.jpg`} role="presentation" className="lex-banner" />
                <div className="below-banner">
                    <div className="container">
                        <div className="col-sm-3 left-list">
                            <button id="login" onClick={changeSelection('login')} className={(login_choice === 'login') ? 'list-selection' : 'non-selected'} >
                                Login
                                <i className="fa fa-chevron-right pull-right" aria-hidden="true" />
                            </button>
                            <button id="register" onClick={changeSelection('register')} className={(login_choice === 'register') ? 'list-selection' : 'non-selected'} >
                                Register
                                <i className="fa fa-chevron-right pull-right" aria-hidden="true" />
                            </button>
                            <button id="password" onClick={changeSelection('password')} className={(login_choice === 'password') ? 'list-selection' : 'non-selected'} >
                                Forgot password
                                <i className="fa fa-chevron-right pull-right" aria-hidden="true" />
                            </button>
                            <button id="username" onClick={changeSelection('username')} className={(login_choice === 'username') ? 'list-selection' : 'non-selected'} >
                                Forgot username
                                <i className="fa fa-chevron-right pull-right" aria-hidden="true" />
                            </button>
                        </div>
                        <div className="col-sm-7 col-sm-offset-1" id="login-select">
                            { login_choice === 'login' ? (
                                <div>
                                    <h2>LOGIN</h2>
                                    <form onSubmit={onLogin}>
                                        <fieldset>
                                            <div className="row">
                                                <div className="col-sm-12 col-md-7">
                                                    <FormGroup label="Username" id="username">
                                                        <input type="text" className="form-control" placeholder="Username" aria-label="Username" />
                                                    </FormGroup>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-12 col-md-7">
                                                    <FormGroup label="Password" id="password">
                                                        <input type="password" className="form-control" placeholder="Password" aria-label="Password" />
                                                    </FormGroup>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <div className="row">
                                            <div className="col-sm-12 col-md-offset-3 col-xs-6">
                                                <button className="btn btn-lex">Login</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            ) : null }
                            { login_choice === 'register' ? (
                                <div>
                                    <h2>REGISTER</h2>
                                    <form onSubmit={onRegister}>
                                        <fieldset>
                                            <div className="row">
                                                <div className="col-sm-12 col-md-7">
                                                    <FormGroup label="Username" id="username_1">
                                                        <input type="text" className="form-control" placeholder="Username" aria-label="Username" />
                                                    </FormGroup>
                                                </div>
                                                <div className="col-sm-12 col-md-7">
                                                    <FormGroup label="Email" id="email">
                                                        <input type="email" className="form-control" placeholder="Email" aria-label="Email" />
                                                    </FormGroup>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-12 col-md-7">
                                                    <FormGroup label="Password" id="password_1">
                                                        <input type="password" className="form-control" placeholder="Password" aria-label="Password" />
                                                    </FormGroup>
                                                </div>
                                                <div className="col-sm-12 col-md-7">
                                                    <FormGroup label="Confirm Password" id="password_2">
                                                        <input type="password" className="form-control" placeholder="Confirm Password" aria-label="Confirm Password" />
                                                    </FormGroup>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-12 col-md-7">
                                                    <FormGroup label="First Name" id="first_name">
                                                        <input type="text" className="form-control" placeholder="First Name" aria-label="First Name" />
                                                    </FormGroup>
                                                </div>
                                                <div className="col-sm-12 col-md-7">
                                                    <FormGroup label="Last Name" id="last_name">
                                                        <input type="text" className="form-control" placeholder="Last Name" aria-label="Last Name" />
                                                    </FormGroup>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <div className="row">
                                            <div className="col-sm-12 col-md-offset-3 col-xs-6 col-md-offset-5">
                                                <button className="btn btn-lex">Register</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            ) : null }
                            { login_choice === 'password' ? (
                                <div>
                                    <h2>FORGOT PASSWORD</h2>
                                    <form onSubmit={forgotPassword}>
                                        <fieldset>
                                            <div className="row">
                                                <div className="col-sm-12 col-md-7">
                                                    <FormGroup label="Email" id="email_2">
                                                        <input type="email" className="form-control" placeholder="Email" aria-label="Email" />
                                                    </FormGroup>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <div className="row">
                                            <div className="col-sm-12 col-md-offset-3 col-xs-6 col-md-offset-5">
                                                <button className="btn btn-lex">Submit</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            ) : null }
                            { login_choice === 'username' ? (
                                <div>
                                    <h2>FORGOT USERNAME</h2>
                                    <form onSubmit={forgotUsername}>
                                        <fieldset>
                                            <div className="row">
                                                <div className="col-sm-12 col-md-7">
                                                    <FormGroup label="Email" id="email_3">
                                                        <input type="email" className="form-control" placeholder="Email" aria-label="Email" />
                                                    </FormGroup>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <div className="row">
                                            <div className="col-sm-12 col-md-offset-3 col-xs-6 col-md-offset-5">
                                                <button className="btn btn-lex">Submit</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            ) : null }
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
        activeForm: state.activeForm,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(formInit());
            const login_init = {
                login_choice: 'login',
            };
            dispatch(formUpdate(login_init));
        },
        changeSelection() {
            return (e) => {
                const login_selection = {
                    login_choice: e.target.id,
                };
                dispatch(formUpdate(login_selection));
            };
        },
        onLogin(event) {
            event.preventDefault();
            dispatch(login())
            .then(() => {
                hashHistory.goBack();
            });
        },
        onRegister(event) {
            event.preventDefault();
            dispatch(register());
        },
        forgotPassword(event) {
            event.preventDefault();
            dispatch(passwordReset());
        },
        forgotUsername(event) {
            event.preventDefault();
            dispatch(sendUsername());
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
