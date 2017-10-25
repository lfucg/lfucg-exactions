import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import FormGroup from './FormGroup';

import {
    passwordForgot,
} from '../actions/apiActions';

import {
    formUpdate,
} from '../actions/formActions'

class ForgotPassword extends React.Component {

    render() {
        const {
            activeForm,
            forgotPassword,
        } = this.props;

        const {
        } = activeForm;

        return (
            <div className="forgotPassword">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>FORGOT PASSWORD</h1>
                    </div>
                </div>
                <div className="inside-body">
                    <div className="container">
                        <div className="col-md-offset-1 col-md-10">
                            <form onSubmit={forgotPassword}>
                                <fieldset>
                                    <div className="row">
                                        <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
                                            <FormGroup label="Email" id="email_2">
                                                <input type="email" className="form-control" placeholder="Email" aria-label="Email" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                </fieldset>
                                <div className="row">
                                    <div className="col-sm-offset-8">
                                        <button className="btn btn-lex">Submit</button>
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

function mapStateToProps(state) {
    return {
        activeForm: state.activeForm,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        forgotPassword(event) {
            const email = document.getElementById('email_2').value;
            console.log(email);
            dispatch(formUpdate({ email }));
            dispatch(passwordForgot());
        },
    };
}

ForgotPassword.propTypes = {
    activeForm: PropTypes.object,
    forgotPassword: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
