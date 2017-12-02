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
import LoadingScreen from './LoadingScreen';

import {
    formUpdate,
} from '../actions/formActions';

import {
    getPagination,
    getPlats,
} from '../actions/apiActions';


class SubdivisionExisting extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }


    render() {
        const {
            currentUser,
            subdivisions,
            plats,
            activeForm,
        } = this.props;

        const platsList = plats && plats.length > 0 &&
            (map((single_plat) => {
                const cabinet = single_plat.cabinet ? `${single_plat.cabinet}-` : '';
                const slide = single_plat.slide ? single_plat.slide : single_plat.name;
                return {
                    id: single_plat.id,
                    name: `${cabinet}${slide}`,
                };
            })(plats));

        const subdivisions_list = subdivisions && subdivisions.length > 0 &&
            map((subdivision) => {
                return (
                    <div key={subdivision.id} className="col-xs-12">
                        <ExistingPageLinks
                          linkStart="subdivision"
                          approval={subdivision.is_approved}
                          title={subdivision.name}
                          permissionModel="subdivision"
                          instanceID={subdivision.id}
                          uniqueReport={false}
                        />
                        <div className="row">
                            <p className="col-md-3 col-sm-offset-1 col-sm-4 col-xs-6">Acres: {subdivision.cleaned_gross_acreage}</p>
                        </div>
                    </div>
                );
            })(subdivisions);

        return (
            <div className="subdivision-existing">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>SUBDIVISIONS - EXISTING</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} route_permission="subdivision" />

                <SearchBar
                  apiCalls={[getPlats]}
                  advancedSearch={[
                    { filterField: 'filter_plat__id', displayName: 'Plat', list: platsList },
                  ]}
                  currentPage="Subdivisions"
                  csvEndpoint="../api/subdivision_search_csv/?"
                />

                <div className="inside-body">
                    <div className="container">
                        {activeForm.loading ? <LoadingScreen /> :
                        (
                            <div>
                                {subdivisions_list}
                                {subdivisions_list ? <Pagination /> : <h1>No Results Found</h1>}
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

SubdivisionExisting.propTypes = {
    currentUser: PropTypes.object,
    subdivisions: PropTypes.array,
    plats: PropTypes.array,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
    activeForm: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        subdivisions: state.subdivisions,
        plats: state.plats,
        activeForm: state.activeForm,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(getPagination('/subdivision/'))
            .then(() => {
                dispatch(formUpdate({ loading: false }));
            });
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(SubdivisionExisting);

