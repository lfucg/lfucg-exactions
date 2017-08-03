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
        formChange: React.PropTypes.func,
    };

    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            activeForm,
            accounts,
            onSubmit,
            formChange,
        } = this.props;

        const submitEnabled =
            activeForm.account_name &&
            activeForm.contact_first_name &&
            activeForm.contact_last_name &&
            activeForm.address_city &&
            activeForm.address_state &&
            activeForm.address_zip &&
            activeForm.phone &&
            activeForm.email;

        return (
            <div className="account-form">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>ACCOUNTS - CREATE</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'account/existing'} parent_name={'Accounts'} />

                <div className="inside-body">
                    <div className="container">
                        <div className="col-sm-offset-1 col-sm-10">
                            <form onSubmit={onSubmit} >

                                <fieldset>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <FormGroup label="* Account Name" id="account_name">
                                                <input type="text" className="form-control" placeholder="Account Name" autoFocus />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="* Contact First Name" id="contact_first_name">
                                                <input type="text" className="form-control" placeholder="Contact First Name" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="* Contact Last Name" id="contact_last_name">
                                                <input type="text" className="form-control" placeholder="Contact Last Name" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-5">
                                            <FormGroup label="* City" id="address_city">
                                                <input type="text" className="form-control" placeholder="City" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-4 form-group">
                                            <label htmlFor="address_state" className="form-label" id="address_state">* State</label>
                                            <select className="form-control" onChange={formChange('address_state')} >
                                                <option value="start_state">State</option>
                                                <option value={['AK', 'Alaska']}>Alaska</option>
                                                <option value={['AL', 'Alabama']}>Alabama</option>
                                                <option value={['AR', 'Arkansas']}>Arkansas</option>
                                                <option value={['AS', 'American Samoa']}>American Samoa</option>
                                                <option value={['AZ', 'Arizona']}>Arizona</option>
                                                <option value={['CA', 'California']}>California</option>
                                                <option value={['CO', 'Colorado']}>Colorado</option>
                                                <option value={['CT', 'Connecticut']}>Connecticut</option>
                                                <option value={['DC', 'District of Columbia']}>District of Columbia</option>
                                                <option value={['DE', 'Delaware']}>Delaware</option>
                                                <option value={['FL', 'Florida']}>Florida</option>
                                                <option value={['GA', 'Georgia']}>Georgia</option>
                                                <option value={['GU', 'Guam']}>Guam</option>
                                                <option value={['HI', 'Hawaii']}>Hawaii</option>
                                                <option value={['IA', 'Iowa']}>Iowa</option>
                                                <option value={['ID', 'Idaho']}>Idaho</option>
                                                <option value={['IL', 'Illinois']}>Illinois</option>
                                                <option value={['IN', 'Indiana']}>Indiana</option>
                                                <option value={['KS', 'Kansas']}>Kansas</option>
                                                <option value={['KY', 'Kentucky']}>Kentucky</option>
                                                <option value={['LA', 'Louisiana']}>Louisiana</option>
                                                <option value={['MA', 'Massachusetts']}>Massachusetts</option>
                                                <option value={['MD', 'Maryland']}>Maryland</option>
                                                <option value={['ME', 'Maine']}>Maine</option>
                                                <option value={['MI', 'Michigan']}>Michigan</option>
                                                <option value={['MN', 'Minnesota']}>Minnesota</option>
                                                <option value={['MO', 'Missouri']}>Missouri</option>
                                                <option value={['MP', 'Northern Mariana Islands']}>Northern Mariana Islands</option>
                                                <option value={['MS', 'Mississippi']}>Mississippi</option>
                                                <option value={['MT', 'Montana']}>Montana</option>
                                                <option value={['NA', 'National']}>National</option>
                                                <option value={['NC', 'North Carolina']}>North Carolina</option>
                                                <option value={['ND', 'North Dakota']}>North Dakota</option>
                                                <option value={['NE', 'Nebraska']}>Nebraska</option>
                                                <option value={['NH', 'New Hampshire']}>New Hampshire</option>
                                                <option value={['NJ', 'New Jersey']}>New Jersey</option>
                                                <option value={['NM', 'New Mexico']}>New Mexico</option>
                                                <option value={['NV', 'Nevada']}>Nevada</option>
                                                <option value={['NY', 'New York']}>New York</option>
                                                <option value={['OH', 'Ohio']}>Ohio</option>
                                                <option value={['OK', 'Oklahoma']}>Oklahoma</option>
                                                <option value={['OR', 'Oregon']}>Oregon</option>
                                                <option value={['PA', 'Pennsylvania']}>Pennsylvania</option>
                                                <option value={['PR', 'Puerto Rico']}>Puerto Rico</option>
                                                <option value={['RI', 'Rhode Island']}>Rhode Island</option>
                                                <option value={['SC', 'South Carolina']}>South Carolina</option>
                                                <option value={['SD', 'South Dakota']}>South Dakota</option>
                                                <option value={['TN', 'Tennessee']}>Tennessee</option>
                                                <option value={['TX', 'Texas']}>Texas</option>
                                                <option value={['UT', 'Utah']}>Utah</option>
                                                <option value={['VA', 'Virginia']}>Virginia</option>
                                                <option value={['VI', 'Virgin Islands']}>Virgin Islands</option>
                                                <option value={['VT', 'Vermont']}>Vermont</option>
                                                <option value={['WA', 'Washington']}>Washington</option>
                                                <option value={['WI', 'Wisconsin']}>Wisconsin</option>
                                                <option value={['WV', 'West Virginia']}>West Virginia</option>
                                                <option value={['WY', 'Wyoming']}>Wyoming</option>
                                            </select>
                                        </div>
                                        <div className="col-sm-3 form-group">
                                            <FormGroup label="* Zipcode" id="address_zip" >
                                                <input type="text" className="form-control" placeholder="Zipcode" />
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <FormGroup label="* Phone" id="phone">
                                                <input type="text" className="form-control" placeholder="Phone Number" />
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup label="* Email" id="email">
                                                <input type="email" className="form-control" placeholder="Email" />
                                            </FormGroup>
                                        </div>
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
                            contact_last_name: data_account.response.contact_last_name,
                            address_city: data_account.response.address_city,
                            address_state: data_account.response.address_state,
                            address_zip: data_account.response.address_zip,
                            phone: data_account.response.phone,
                            email: data_account.response.email,
                        };
                        dispatch(formUpdate(update));
                    });
                }
            });
        },
        formChange(field) {
            return (e, ...args) => {
                const value = typeof e.target.value !== 'undefined' ? e.target.value : args[1];

                const comma_index = value.indexOf(',');
                const value_id = value.substring(0, comma_index);
                const value_name = value.substring(comma_index + 1, value.length);
                const field_name = `${[field]}_name`;

                const update = {
                    [field]: value_id,
                    [field_name]: value_name,
                };
                dispatch(formUpdate(update));
            };
        },
        onSubmit(event) {
            event.preventDefault();
            if (selectedAccount) {
                dispatch(putAccount(selectedAccount))
                .then(() => {
                    hashHistory.push(`account/summary/${selectedAccount}`);
                });
            } else {
                dispatch(postAccount())
                .then((data_post) => {
                    hashHistory.push(`account/summary/${data_post.response.id}`);
                });
            }
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountForm);

