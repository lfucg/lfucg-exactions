import React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

import Navbar from './Navbar';
import Footer from './Footer';
import FormGroup from './FormGroup';

import {
    sendUsername,
} from '../actions/apiActions';

class ForgotUsername extends React.Component {
    static propTypes = {
        activeForm: React.PropTypes.object,
        forgotUsername: React.PropTypes.func,
    }

    render() {
        const {
            activeForm,
            forgotUsername,
        } = this.props;

        const {
        } = activeForm;

        return (
            <div className="login">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>FORGOT USERNAME</h1>
                    </div>
                </div>
                <div className="inside-body">
                    <div className="container">
                        <div className="col-md-offset-1 col-md-10">
                            <form onSubmit={forgotUsername}>
                                <fieldset>
                                    <div className="row">
                                        <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
                                            <FormGroup label="Email" id="email_3">
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
        forgotUsername(event) {
            event.preventDefault();
            dispatch(sendUsername())
            .then(() => {
                hashHistory.push('login/');
            });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotUsername);
