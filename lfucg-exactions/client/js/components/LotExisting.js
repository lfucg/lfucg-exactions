import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

import {
    getLots,
    getLotQuery,
} from '../actions/apiActions';

import {
    formUpdate,
} from '../actions/formActions';

class LotExisting extends React.Component {
    static propTypes = {
        currentUser: React.PropTypes.object,
        lots: React.PropTypes.object,
        route: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
        onLotQuery: React.PropTypes.func,
    };

    componentDidMount() {
        this.props.onComponentDidMount();
    }


    render() {
        const {
            currentUser,
            lots,
            onLotQuery,
        } = this.props;

        const lots_list = lots.length > 0 ? (
            map((lot) => {
                return (
                    <div key={lot.id} className="col-xs-12">
                        <div className="row form-subheading">
                            <div className="col-sm-7 col-md-9">
                                <h3>{lot.address_full}</h3>
                            </div>
                            <div className="col-sm-5 col-md-3">
                                <div className="col-xs-5">
                                    {currentUser && currentUser.permissions && currentUser.permissions.lot &&
                                        <Link to={`lot/form/${lot.id}`} className="btn btn-mid-level">
                                            Edit
                                        </Link>
                                    }
                                </div>
                                <div className="col-xs-5 col-xs-offset-1">
                                    <Link to={`lot/summary/${lot.id}`} className="btn btn-mid-level">
                                        Summary
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-offset-1">
                                <h3 className="col-xs-12">Total Exactions: ${lot.total_due}</h3>
                                <p className="col-md-4 col-xs-6">Plat Name: {lot.plat.name}</p>
                                <p className="col-md-4 col-xs-6">Lot Number: {lot.lot_number}</p>
                                <p className="col-md-4 col-xs-6 ">Permit ID: {lot.permit_id}</p>
                            </div>
                        </div>
                    </div>
                );
            })(lots)
        ) : null;

        return (
            <div className="lot-existing">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <div className="col-sm-8">
                            <h1>LOTS - EXISTING</h1>
                        </div>
                        {currentUser && currentUser.permissions && currentUser.permissions.lot &&
                            <div className="col-sm-2 col-sm-offset-1">
                                <Link to={'lot/form/'} className="btn btn-top-level" >
                                    Create
                                </Link>
                            </div>
                        }
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} />

                <div className="row search-box">
                    <form onChange={onLotQuery('query')} className="col-sm-10 col-sm-offset-1" >
                        <fieldset>
                            <div className="col-sm-2 col-xs-12">
                                <label htmlFor="query" className="form-label">Search</label>
                            </div>
                            <div className="col-sm-10 col-xs-12">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Search Lots"
                                />
                            </div>
                        </fieldset>
                    </form>
                </div>

                <div className="inside-body">
                    <div className="container">
                        {lots_list}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        lots: state.lots,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(getLots());
        },
        onLotQuery(field) {
            return (e, ...args) => {
                const value = typeof e.target.value !== 'undefined' ? e.target.value : args[1];
                const update = {
                    [field]: value,
                };
                dispatch(formUpdate(update));
                dispatch(getLotQuery());
            };
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(LotExisting);

