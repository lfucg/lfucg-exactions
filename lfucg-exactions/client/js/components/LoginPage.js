import React from 'react';
import { connect } from 'react-redux';
import { hashHistory, Link } from 'react-router';
import PropTypes from 'prop-types';

import FlashMessage from './FlashMessage';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

import FormGroup from './FormGroup';

import {
    login,
} from '../actions/apiActions';

import {
    flashMessageSet,
} from '../actions/flashMessageActions';

class Login extends React.Component {
    render() {
        const {
            activeForm,
            onLogin,
        } = this.props;

        const {
        } = activeForm;

        return (
            <div className="login-page">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>LOGIN</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} />

                <div className="inside-body">
                    <div className="container">
                        <FlashMessage />
                        <div className="col-md-offset-1 col-md-10">
                            <form onSubmit={onLogin}>
                                <fieldset>
                                    <div className="row">
                                        <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
                                            <FormGroup label="Username" id="username">
                                                <input type="text" className="form-control" placeholder="Username" aria-label="Username" autoFocus />
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
                                    <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
                                        <Link to="forgot-password/" role="link" className="btn btn-link pull-left">Forgot Password?</Link>
                                        <button className="btn btn-lex pull-right" style={{ 'marginTop': 0 }}>Login</button>
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

Login.propTypes = {
    activeForm: PropTypes.object,
    route: PropTypes.object,
    onLogin: PropTypes.func,
};

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
            .then((response) => {
                if (response.error) {
                    dispatch(flashMessageSet('The username/password combination you entered didn\'t match our records. Please try again.', 'danger'));
                } else {
                    hashHistory.push('dashboard/');
                    dispatch(flashMessageSet('Login successful', 'success'));
                }
            });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
