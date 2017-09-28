import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { map } from 'ramda';
import {
    searchQuery,
    getPagination,
    getPlats,
    getLots,
} from '../actions/apiActions';

import {
    formUpdate,
    formReset,
} from '../actions/formActions';

class SearchBar extends React.Component {
    componentDidount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            onQuery,
            activeForm,
            plats,
            lots,
            onAccountFilter,
            advancedSearchPopulation,
            clearFilters,
        } = this.props;

        const platsList = plats && plats.length > 0 &&
            (map((single_plat) => {
                return (
                    <option key={single_plat.id} value={single_plat.id} >
                        {single_plat.name}
                    </option>
                );
            })(plats));

        const lotsList = lots && lots.length > 0 &&
            (map((single_lot) => {
                return (
                    <option key={single_lot.id} value={single_lot.id} >
                        {single_lot.address_full}
                    </option>
                );
            })(lots));

        return (
            <div>
                <div className="row search-box">
                    <form onChange={onQuery('filter_search')} className="col-sm-10 col-sm-offset-1" >
                        <fieldset>
                            <div className="col-sm-2 col-xs-12">
                                <label htmlFor="query" className="form-label">Search</label>
                            </div>
                            <div className="col-sm-10 col-xs-12">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter search..."
                                  id="query"
                                />
                            </div>
                        </fieldset>
                    </form>
                </div>
                <div>
                    <a
                      role="button"
                      data-toggle="collapse"
                      data-parent="#accordion"
                      href="#AdvancedSearch"
                      aria-expanded="false"
                      aria-controls="AdvancedSearch"
                      id="searchAccordionControl"
                    >
                        {activeForm.filterToggle ? (
                            <div className="row" role="tab" id="headingAdvancedSearch" onClick={clearFilters}>
                                <div className="col-xs-10 col-xs-offset-1 text-center">
                                    <h5>Clear All Search Filters</h5>
                                </div>
                            </div>
                            ) : (
                            <div className="row" role="tab" id="headingAdvancedSearch" onClick={advancedSearchPopulation}>
                                <div className="col-xs-10 col-xs-offset-1 text-center">
                                    <h5>Advanced Search</h5>
                                </div>
                            </div>
                            )
                        }
                    </a>
                    <div
                      id="AdvancedSearch"
                      className="collapse row"
                      aria-labelledby="#headingAdvancedSearch"
                    >
                        <div className="col-xs-12 text-center">
                            <div className="row">
                                <div className="col-sm-6 form-group">
                                    <div className="col-sm-2 col-xs-12">
                                        <label htmlFor="filter_plat_account__id" className="form-label">Plat</label>
                                    </div>
                                    <div className="col-sm-10 col-xs-12">
                                        <select
                                          className="form-control"
                                          onChange={() => onAccountFilter(this.plat_account)}
                                          ref={(input) => { this.plat_account = input; }}
                                          name="filter_plat_account__id"
                                        >
                                            <option value="">
                                                Select Plat
                                            </option>
                                            {platsList}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-6 form-group">
                                    <div className="col-sm-2 col-xs-12">
                                        <label htmlFor="filter_lot_account__id" className="form-label">Lot</label>
                                    </div>
                                    <div className="col-sm-10 col-xs-12">
                                        <select
                                          className="form-control"
                                          onChange={() => onAccountFilter(this.lot_account)}
                                          ref={(input) => { this.lot_account = input; }}
                                          name="filter_lot_account__id"
                                        >
                                            <option value="">
                                                Select Lot
                                            </option>
                                            {lotsList}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

SearchBar.propTypes = {
    onComponentDidMount: PropTypes.func,
    onQuery: PropTypes.func,
    activeForm: PropTypes.object,
    plats: PropTypes.array,
    lots: PropTypes.array,
    onAccountFilter: PropTypes.func,
    clearFilters: PropTypes.func,
    advancedSearchPopulation: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        activeForm: state.activeForm,
        plats: state.plats,
        lots: state.lots,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(formUpdate({ filterToggle: true }));
        },
        onQuery(field) {
            return (e, ...args) => {
                const value = typeof e.target.value !== 'undefined' ? e.target.value : args[1];
                const update = {
                    [field]: value,
                };
                dispatch(formUpdate(update));
                dispatch(searchQuery());
            };
        },
        onAccountFilter(field) {
            const update = {
                [field.name]: field.value,
            };
            dispatch(formUpdate(update));
            dispatch(searchQuery());
        },
        advancedSearchPopulation() {
            dispatch(formUpdate({ filterToggle: true }));
            dispatch(getPlats());
            // dispatch(getLots());
        },
        clearFilters() {
            dispatch(formUpdate({ filterToggle: false }));
            dispatch(formReset());
            document.getElementById('query').value = '';
            dispatch(getPagination());
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
