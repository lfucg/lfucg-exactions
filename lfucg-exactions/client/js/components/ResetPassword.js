import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import FormGroup from './FormGroup';

import {
    passwordReset,
} from '../actions/apiActions';

import {
    formUpdate,
} from '../actions/formActions';

class ResetPassword extends React.Component {

    render() {
        const {
            activeForm,
            resetPassword,
            handleUserInput,
        } = this.props;

        const {
        } = activeForm;

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
                        <div className="col-md-offset-1 col-md-10">
                            <form onSubmit={resetPassword}>
                                <fieldset>
                                    <div className="row">
                                        <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
                                            <FormGroup label="Enter Password" id="password_1">
                                                <input
                                                  type="password"
                                                  className="form-control"
                                                  placeholder="Enter Password"
                                                  aria-label="Password Enter"
                                                  onChange={handleUserInput}
                                                />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
                                            <FormGroup label="Confirm Password" id="password_2">
                                                <input
                                                  type="password"
                                                  className="form-control"
                                                  placeholder="Enter Password"
                                                  aria-label="Password Enter"
                                                  onChange={handleUserInput}
                                                />
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

function mapDispatchToProps(dispatch, params) {
    const userToken = params.params.token;
    const userID = params.params.uid;
    return {
        onComponentDidMount() {
            // app.get('/reset/:token', function(req, res) {
            //   User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            //     if (!user) {
            //       req.flash('error', 'Password reset token is invalid or has expired.');
            //       return res.redirect('/forgot');
            //     }
            //     res.render('reset', {
            //       user: req.user
            //     });
            //   });
            // });
        },
        resetPassword() {
            // console.log('hellow');
            const newPassword1 = document.getElementById('password_1').value;
            const newPassword2 = document.getElementById('password_2').value;
            dispatch(formUpdate({ newPassword1, newPassword2 }));
            dispatch(passwordReset(userToken, userID));
        },
    };
}

ResetPassword.propTypes = {
    activeForm: PropTypes.object,
    resetPassword: PropTypes.func,
    handleUserInput: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
