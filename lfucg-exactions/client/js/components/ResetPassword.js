import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    hashHistory,
} from 'react-router';
import FlashMessage from './FlashMessage';
import Navbar from './Navbar';
import Footer from './Footer';
import FormGroup from './FormGroup';

import {
    passwordReset,
} from '../actions/apiActions';

import {
    flashMessageSet,
} from '../actions/flashMessageActions';

import {
    formInit,
} from '../actions/formActions';

class ResetPassword extends React.Component {
    componentDidMount() {
    }

    render() {
        const {
            activeForm,
            resetPassword,
        } = this.props;

        const {
        } = activeForm;

        const submitEnabled =
            activeForm.password_1 &&
            activeForm.password_2 &&
            activeForm.password_1 === activeForm.password_2;

        return (
            <div className="resetPassword">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>RESET PASSWORD</h1>
                    </div>
                </div>


                <div className="inside-body">
                    <div className="container">
                        <FlashMessage />
                        <div className="col-md-offset-1 col-md-10">
                            <form onSubmit={resetPassword}>
                                <fieldset>
                                    <div className="row">
                                        <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
                                            <FormGroup label="Enter Password" id="password_1">
                                                <input
                                                  type="password"
                                                  className={`form-control ${activeForm.password_1 !== activeForm.password_2 ? 'error' : ''}`}
                                                  placeholder="Enter Password"
                                                  aria-label="Password Enter"
                                                />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
                                            <FormGroup label="Confirm Password" id="password_2">
                                                <input
                                                  type="password"
                                                  className={`form-control ${activeForm.password_1 !== activeForm.password_2 ? 'error' : ''}`}
                                                  placeholder="Confirm Password"
                                                  aria-label="Password Confirm"
                                                />
                                            </FormGroup>
                                            <p className={`help-block bg-danger text-center ${activeForm.password_1 !== activeForm.password_2 ? '' : 'hidden'}`} aria-label="Password Mismatch Warning">
                                                <i className="fa fa-exclamation-circle" />&nbsp;Your passwords do not match.
                                            </p>
                                        </div>
                                    </div>
                                </fieldset>
                                <div className="row">
                                    <div className="col-sm-offset-8">
                                        <button disabled={!submitEnabled} className="btn btn-lex">Submit</button>
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

function mapDispatchToProps(dispatch, params) {
    const userToken = params.params.token;
    const userID = params.params.uid;
    return {
        resetPassword() {
            dispatch(passwordReset(userToken, userID))
            .then((response) => {
                if (response.error) {
                    dispatch(flashMessageSet('Looks like you\'ve used this link before or your link has expired. Please submit your email again to get a new link sent to your email.', 'danger'));
                } else {
                    hashHistory.push('login/');
                    dispatch(flashMessageSet('Your password has been updated! Please login.', 'success'));
                    dispatch(formInit());
                }
            });
        },
    };
}

ResetPassword.propTypes = {
    activeForm: PropTypes.object,
    resetPassword: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
