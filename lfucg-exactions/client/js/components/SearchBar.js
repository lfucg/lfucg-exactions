import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { map } from 'ramda';
import {
    searchQuery,
    getPagination,
} from '../actions/apiActions';

import {
    formUpdate,
    formReset,
} from '../actions/formActions';

class SearchBar extends React.Component {
    componentDidount() {
        this.props.onComponentDidMount({
            filterField1DisplayName: this.props.filterField1DisplayName,
            filterField2DisplayName: this.props.filterField2DisplayName,
            apiCalls: this.props.apiCalls,
            filterField1: this.props.filterField1,
            filterField2: this.props.filterField2,
        });
    }

    render() {
        const {
            onQuery,
            activeForm,
            plats,
            lots,
            onFilter,
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
                            <div className="row" role="tab" id="headingAdvancedSearch" >
                                <div className="col-xs-10 col-xs-offset-1 text-center">
                                    <button className="btn btn-link" onClick={clearFilters}>Clear All Search Filters</button>
                                </div>
                            </div>
                            ) : (
                                <div className="row" role="tab" id="headingAdvancedSearch" >
                                    <div className="col-xs-10 col-xs-offset-1 text-center">
                                        <button className="btn btn-link" onClick={advancedSearchPopulation}>Advanced Search</button>
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
                                        <label htmlFor={this.props.filterField1} className="form-label">{this.props.filterField1DisplayName}</label>
                                    </div>
                                    <div className="col-sm-10 col-xs-12">
                                        <select
                                          className="form-control"
                                          onChange={() => onFilter(this.field_one)}
                                          ref={(input) => { this.field_one = input; }}
                                          name={this.props.filterField1}
                                        >
                                            <option value="">
                                                Select {this.props.filterField1DisplayName}
                                            </option>
                                            {platsList}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-6 form-group">
                                    <div className="col-sm-2 col-xs-12">
                                        <label htmlFor={this.props.filterField2} className="form-label">{this.props.filterField2DisplayName}</label>
                                    </div>
                                    <div className="col-sm-10 col-xs-12">
                                        <select
                                          className="form-control"
                                          onChange={() => onFilter(this.field_two)}
                                          ref={(input) => { this.field_two = input; }}
                                          name={this.props.filterField2}
                                        >
                                            <option value="">
                                                Select {this.props.filterField2DisplayName}
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
    onFilter: PropTypes.func,
    clearFilters: PropTypes.func,
    advancedSearchPopulation: PropTypes.func,
    filterField1: PropTypes.string,
    filterField2: PropTypes.string,
    filterField1DisplayName: PropTypes.string,
    filterField2DisplayName: PropTypes.string,
    apiCalls: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        activeForm: state.activeForm,
        plats: state.plats,
        lots: state.lots,
    };
}

function mapDispatchToProps(dispatch, props) {
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
        onFilter(field) {
            const update = {
                [field.name]: field.value,
            };
            dispatch(formUpdate(update));
            dispatch(searchQuery());
        },
        advancedSearchPopulation() {
            dispatch(formUpdate({ filterToggle: true }));
            (map((apiFunction) => {
                dispatch(apiFunction());
            })(props.apiCalls));
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
