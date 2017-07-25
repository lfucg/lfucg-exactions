import React from 'react';
import { connect } from 'react-redux';
import {
    Link,
    hashHistory,
} from 'react-router';

import Navbar from './Navbar';
import Footer from './Footer';

import FormGroup from './FormGroup';
import Breadcrumbs from './Breadcrumbs';

import {
    formInit,
    formUpdate,
} from '../actions/formActions';

import {
    getMe,
    getAccountID,
    postAccount,
    putAccount,
} from '../actions/apiActions';

class AccountForm extends React.Component {
    static propTypes = {
        activeForm: React.PropTypes.object,
        accounts: React.PropTypes.object,
        route: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
        onSubmit: React.PropTypes.func,
    };

    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            activeForm,
            accounts,
            onSubmit,
        } = this.props;

        const submitEnabled =
            activeForm.account_name &&
            activeForm.contact_first_name;

        return (
            <div className="account-form">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>ACCOUNTS - CREATE</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'account'} parent_name={'Accounts'} />

                <div className="inside-body">
                    <div className="container">
                        <div className="col-sm-offset-1 col-sm-10">
                            <form onSubmit={onSubmit} >

                                <fieldset>
                                    <div className="row">
                                        <FormGroup label="* Account Name" id="account_name">
                                            <input type="text" className="form-control" placeholder="Account Name" autoFocus />
                                        </FormGroup>
                                    </div>
                                    <div className="row">
                                        <FormGroup label="* Contact First Name" id="contact_first_name">
                                            <input type="text" className="form-control" placeholder="Contact First Name" />
                                        </FormGroup>
                                    </div>
                                </fieldset>
                                <button disabled={!submitEnabled} className="btn btn-lex">Submit</button>
                                {!submitEnabled ? (
                                    <div>
                                        <div className="clearfix" />
                                        <span> * All required fields must be filled.</span>
                                    </div>
                                ) : null
                                }
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
        accounts: state.accounts,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedAccount = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(formInit());
            dispatch(getMe())
            .then((data_me) => {
                if (data_me.error) {
                    hashHistory.push('login/');
                }
                if (selectedAccount) {
                    dispatch(getAccountID(selectedAccount))
                    .then((data_account) => {
                        const update = {
                            account_name: data_account.response.account_name,
                            contact_first_name: data_account.response.contact_first_name,
                        };
                        dispatch(formUpdate(update));
                    });
                }
            });
        },
        onSubmit(event) {
            event.preventDefault();
            dispatch(postAccount())
            .then(() => {
                hashHistory.push('account/existing/');
            });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountForm);

