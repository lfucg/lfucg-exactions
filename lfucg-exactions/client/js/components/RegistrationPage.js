import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import FormGroup from './FormGroup';

import {
    register,
} from '../actions/apiActions';

class Registration extends React.Component {
    render() {
        const {
            activeForm,
            onRegister,
        } = this.props;

        const {
        } = activeForm;

        return (
            <div className="registration">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>REGISTRATION</h1>
                    </div>
                </div>
                <div className="inside-body">
                    <div className="container">
                        <div className="col-md-offset-1 col-md-10">
                            <form onSubmit={onRegister}>
                                <fieldset>
                                    <div className="row">
                                        <div className="col-sm-6 col-sm-offset-3">
                                            <FormGroup label="Username" id="username_1">
                                                <input type="text" className="form-control" placeholder="Username" aria-label="Username" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6 col-sm-offset-3">
                                            <FormGroup label="Email" id="email">
                                                <input type="email" className="form-control" placeholder="Email" aria-label="Email" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6 col-sm-offset-3">
                                            <FormGroup label="Password" id="password_1">
                                                <input type="password" className="form-control" placeholder="Password" aria-label="Password" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6 col-sm-offset-3">
                                            <FormGroup label="Confirm Password" id="password_2">
                                                <input type="password" className="form-control" placeholder="Confirm Password" aria-label="Confirm Password" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6 col-sm-offset-3">
                                            <FormGroup label="First Name" id="first_name">
                                                <input type="text" className="form-control" placeholder="First Name" aria-label="First Name" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6 col-sm-offset-3">
                                            <FormGroup label="Last Name" id="last_name">
                                                <input type="text" className="form-control" placeholder="Last Name" aria-label="Last Name" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                </fieldset>
                                <div className="row">
                                    <div className="col-sm-offset-8">
                                        <button className="btn btn-lex">Register</button>
                                    </div>
                                </div>
                                <br />
                            </form>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

Registration.propTypes = {
    activeForm: PropTypes.object,
    onRegister: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        activeForm: state.activeForm,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onRegister(event) {
            event.preventDefault();
            dispatch(register())
            .then(() => {
                hashHistory.push('login/');
            });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Registration);
