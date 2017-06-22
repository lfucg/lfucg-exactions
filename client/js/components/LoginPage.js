import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

import Navbar from './Navbar';
import Footer from './Footer';
import FormGroup from './FormGroup';

import { login } from '../actions/apiActions';

class Login extends React.Component {
    static propTypes = {
        activeForm: React.PropTypes.object,
        onLogin: React.PropTypes.func,
    };

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
                <img src={`${global.BASE_STATIC_URL}/lexington-hero-interior.jpg`} role="presentation" className="lex-banner" />
                <div className="below-banner">
                    <div className="container">
                        <div className="col-sm-3 left-list">
                            <div className="row">
                                <a href="">
                                    Login
                                    <i className="fa fa-chevron-right pull-right" aria-hidden="true" />
                                </a>
                            </div>
                            <div className="row">
                                <a href="">
                                    Register
                                    <i className="fa fa-chevron-right pull-right" aria-hidden="true" />
                                </a>
                            </div>
                            <div className="row">
                                <a href="">
                                    Forgot password
                                    <i className="fa fa-chevron-right pull-right" aria-hidden="true" />
                                </a>
                            </div>
                            <div className="row">
                                <a href="">
                                    Forgot username
                                    <i className="fa fa-chevron-right pull-right" aria-hidden="true" />
                                </a>
                            </div>
                        </div>
                        <div className="col-sm-8 col-sm-offset-1" id="login-select">
                            <h2>LOGIN</h2>
                            <form onSubmit={onLogin}>
                                <fieldset>
                                    <div className="row">
                                        <div className="col-sm-7">
                                            <FormGroup label="Username" id="username">
                                                <input type="text" className="form-control" placeholder="Username" aria-label="Username" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-7">
                                            <FormGroup label="Password" id="password">
                                                <input type="password" className="form-control" placeholder="Password" aria-label="Password" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                </fieldset>
                                <div className="row">
                                    <div className="col-sm-offset-3 col-xs-6">
                                        <button className="btn btn-lex">Login</button>
                                    </div>
                                </div>
                            </form>
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
        onLogin() {
            dispatch(login())
            .then(() => {
                hashHistory.goBack();
            });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
