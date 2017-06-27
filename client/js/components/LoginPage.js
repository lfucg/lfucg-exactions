import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { hashHistory } from 'react-router';

import Navbar from './Navbar';
import Footer from './Footer';
import FormGroup from './FormGroup';

import {
    login,
} from '../actions/apiActions';

class Login extends React.Component {
    static propTypes = {
        activeForm: React.PropTypes.object,
        onLogin: React.PropTypes.func,
    }

    render() {
        const {
            activeForm,
            onLogin,
        } = this.props;

        const {
        } = activeForm;

        return (
            <div className="login">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>LOGIN</h1>
                    </div>
                </div>
                <div className="inside-body">
                    <div className="container">
                        <div className="col-md-offset-1 col-md-10">
                            <form onSubmit={onLogin}>
                                <fieldset>
                                    <div className="row">
                                        <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
                                            <FormGroup label="Username" id="username">
                                                <input type="text" className="form-control" placeholder="Username" aria-label="Username" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
                                            <FormGroup label="Password" id="password">
                                                <input type="password" className="form-control" placeholder="Password" aria-label="Password" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                </fieldset>
                                <div className="row">
                                    <div className="col-sm-offset-8">
                                        <button className="btn btn-lex">Login</button>
                                    </div>
                                </div>
                            </form>
                            <div className="row login-link-row">
                                <div className="col-md-offset-3 col-md-6 col-sm-8 col-sm-offset-2">
                                    <div className="col-sm-3">
                                        <Link to="registration/" role="link" className="btn btn-lex">Register</Link>
                                    </div>
                                    <div className="col-sm-4">
                                        <Link to="forgot-password/" role="link" className="btn btn-lex">Forgot Password</Link>
                                    </div>
                                    <div className="col-sm-4">
                                        <Link to="forgot-username/" role="link" className="btn btn-lex">Forgot Username</Link>
                                    </div>
                                </div>
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
        activeForm: state.activeForm,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onLogin(event) {
            event.preventDefault();
            dispatch(login())
            .then(() => {
                hashHistory.goBack();
            });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
