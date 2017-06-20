import React from 'react';
import { connect } from 'react-redux';

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
                <form onSubmit={onLogin}>
                    <fieldset>
                        <div className="col-sm-1">
                            <h3>Login</h3>
                        </div>
                        <div className="col-sm-5">
                            <FormGroup label="Username" id="username">
                                <input type="text" className="form-control" placeholder="Username" aria-label="Username" />
                            </FormGroup>
                        </div>
                        <div className="col-sm-5">
                            <FormGroup label="Password" id="password">
                                <input type="password" className="form-control" placeholder="Password" aria-label="Password" />
                            </FormGroup>
                        </div>
                        <div className="col-sm-1">
                            <button className="btn">Login</button>
                        </div>
                    </fieldset>
                </form>
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
