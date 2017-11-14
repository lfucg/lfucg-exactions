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
import ExistingPageLinks from './ExistingPageLinks';

import { expansion_areas, agreement_types } from '../constants/searchBarConstants';

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

        const accountsList = accounts && accounts.length > 0 &&
            (map((single_account) => {
                return {
                    id: single_account.id,
                    name: single_account.account_name,
                };
            })(accounts));

        const agreements_list = agreements.length > 0 ? (
            map((agreement) => {
                return (
                    <div key={agreement.id} className="col-xs-12">
                        {(currentUser.id || agreement.is_approved) && <div>
                            <ExistingPageLinks
                              linkStart="agreement"
                              approval={agreement.is_approved}
                              title={`Resolution Number: ${agreement.resolution_number}`}
                              permissionModel="agreement"
                              instanceID={agreement.id}
                              uniqueReport={true}
                            />
                            <div className="row">
                                <div className="col-sm-offset-1">
                                    <p className="col-md-4 col-xs-6">Current Balance: {agreement.agreement_balance && agreement.agreement_balance.total}</p>
                                    <p className="col-md-4 col-xs-6">Account: {agreement.account_id && agreement.account_id.account_name}</p>
                                    <p className="col-md-4 col-xs-6">Expansion Area: {agreement.expansion_area}</p>
                                    <p className="col-md-4 col-xs-6">Agreement Type: {agreement.agreement_type_display}</p>
                                    <p className="col-md-4 col-xs-6 ">Date Executed: {agreement.date_executed}</p>
                                </div>
                            </div>
                        </div>}
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

                <Breadcrumbs route={this.props.route} route_permission="agreement" />

                <SearchBar
                  apiCalls={[getAccounts]}
                  advancedSearch={[
                    { filterField: 'filter_agreement_type', displayName: 'Type', list: agreement_types },
                    { filterField: 'filter_account_id', displayName: 'Developer', list: accountsList },
                    { filterField: 'filter_expansion_area', displayName: 'EA', list: expansion_areas },
                    { filterField: 'filter_is_approved', displayName: 'Approval', list: [{ id: true, name: 'Approved' }, { id: false, name: 'Unapproved' }] },
                  ]}
                  currentPage="Agreements"
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

