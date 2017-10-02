import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import Pagination from './Pagination';
import SearchBar from './SearchBar';

import {
    getPagination,
    getAccounts,
} from '../actions/apiActions';

class AgreementExisting extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            currentUser,
            agreements,
            accounts,
        } = this.props;

        const agreement_types = [
            { id: 'MEMO', name: 'Memo' },
            { id: 'RESOLUTION', name: 'Resolution' },
            { id: 'OTHER', name: 'Other' },
        ];

        const accountsList = accounts && accounts.length > 0 &&
            (map((single_account) => {
                return {
                    id: single_account.id,
                    name: single_account.account_name,
                };
            })(accounts));

        const expansion_areas = [
            { id: 'EA-1', name: 'EA-1' },
            { id: 'EA-2A', name: 'EA-2A' },
            { id: 'EA-2B', name: 'EA-2B' },
            { id: 'EA-2C', name: 'EA-2C' },
            { id: 'EA-3', name: 'EA-3' },
        ];

        const agreements_list = agreements.length > 0 ? (
            map((agreement) => {
                return (
                    <div key={agreement.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <div className="col-sm-7 col-md-9">
                                <h3>Resolution Number: {agreement.resolution_number}</h3>
                            </div>
                        </div>
                        <div className="row link-row">
                            <div className="col-xs-12 col-sm-5 col-md-3 col-sm-offset-7 col-md-offset-9">
                                <div className="col-xs-5">
                                    {currentUser && currentUser.permissions && currentUser.permissions.agreement &&
                                        <Link to={`agreement/form/${agreement.id}`} aria-label="Edit">
                                            <i className="fa fa-pencil-square link-icon col-xs-4" aria-hidden="true" />
                                            <div className="col-xs-7 link-label">
                                                Edit
                                            </div>
                                        </Link>
                                    }
                                </div>
                                <div className="col-xs-5 ">
                                    <Link to={`agreement/summary/${agreement.id}`} aria-label="Summary">
                                        <i className="fa fa-file-text link-icon col-xs-4" aria-hidden="true" />
                                        <div className="col-xs-7 link-label">
                                            Summary
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-offset-1">
                                <p className="col-md-4 col-xs-6">Account: {agreement.account_id.account_name}</p>
                                <p className="col-md-4 col-xs-6">Expansion Area: {agreement.expansion_area}</p>
                                <p className="col-md-4 col-xs-6">Agreement Type: {agreement.agreement_type_display}</p>
                                <p className="col-md-4 col-xs-6 ">Date Executed: {agreement.date_executed}</p>
                            </div>
                        </div>
                    </div>
                );
            })(agreements)
        ) : null;

        return (
            <div className="agreement-existing">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>AGREEMENTS - EXISTING</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} />

                <SearchBar
                  apiCalls={[getAccounts]}
                  advancedSearch={[
                    { filterField: 'filter_agreement_type', displayName: 'Type', list: agreement_types },
                    { filterField: 'filter_account_id', displayName: 'Developer', list: accountsList },
                    { filterField: 'filter_expansion_area', displayName: 'EA', list: expansion_areas },
                  ]}
                />

                <div className="inside-body">
                    <div className="container">
                        {agreements_list}
                        {agreements_list ? <Pagination /> : <h1>No Results Found</h1>}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

AgreementExisting.propTypes = {
    currentUser: PropTypes.object,
    agreements: PropTypes.array,
    accounts: PropTypes.array,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        agreements: state.agreements,
        accounts: state.accounts,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(getPagination('/agreement/'));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AgreementExisting);

