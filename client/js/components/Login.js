import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import FormGroup from './FormGroup';

import { login } from '../actions/apiActions';
import {
    formInit,
    formUpdate,
} from '../actions/formActions';

class Login extends React.Component {
    static propTypes = {
        onLogin: React.PropTypes.func,
    };

    render() {
        const {
            onLogin,
        } = this.props;

        // const {
        // } = activeForm;

        return (
            <div className="login">
                <form onSubmit={onLogin}>
                    <fieldset>
                        <h3>Login</h3>
                        <div className="row">
                            <FormGroup label="Username" id="username">
                                <input type="text" className="form-control" placeholder="Username" aria-label="Username" />
                            </FormGroup>
                        </div>
                        <div className="row">
                            <FormGroup label="Password" id="password">
                                <input type="password" className="form-control" placeholder="Password" aria-label="Password" />
                            </FormGroup>
                        </div>
                    </fieldset>
                    <button className="btn">Login</button>
                </form>
            </div>
        );
    }
}

// function mapState(state) {
// }

function mapDispatch(dispatch) {
    return {
        onLogin() {
            console.log('ON LOGIN');
            dispatch(login());
        },
    };
}

export default connect(mapDispatch)(Login);
