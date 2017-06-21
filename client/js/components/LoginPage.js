import React from 'react';
import { connect } from 'react-redux';

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
                            <ul>
                                <li>
                                    <a href="">Login</a>
                                </li>
                                <li>
                                    <a href="">Register</a>
                                </li>
                                <li>
                                    <a href="">Forgot password</a>
                                </li>
                                <li>
                                    <a href="">Forgot username</a>
                                </li>
                            </ul>
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
            console.log('ON LOGIN');
            dispatch(login());
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
