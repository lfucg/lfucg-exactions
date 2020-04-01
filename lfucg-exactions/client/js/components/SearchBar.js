import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  compose,
  filter,
  map,
  path,
  reduce,
  toString,
} from 'ramda';

import FormGroup from './FormGroup';
import {
  searchQuery,
  getPagination,
} from '../actions/apiActions';

import {
  formUpdate,
  formReset,
} from '../actions/formActions';

import {
  clearSearch,
  updateSearch,
} from '../actions/searchActions';

class SearchBar extends React.Component {
  state = {
    filter_showDeleted: false,
  };

  componentDidMount() {
    this.props.onComponentDidMount({
      apiCalls: this.props.apiCalls,
      advancedSearch: this.props.advancedSearch,
      csvEndpoint: this.props.csvEndpoint,
      SecondaryCsvEndpoint: this.props.SecondaryCsvEndpoint,
      dateFilters: this.props.dateFilters,
    });
  }
  
  render() {
    const {
      activeForm,
      advancedSearchPopulation,
      clearFilters,
      currentPage,
      currentUser,
      onFilter,
      onSearchTextChange,
      search,
      toggleShowDeleted,
    } = this.props;

    const page = currentPage.replace(' ', '');

    const queryString = compose(
      reduce((acc, value) => acc + value, this.props.csvEndpoint),
      map((key_name) => {
        const filter_index = key_name.indexOf('filter_') + 'filter_'.length;
        const field = key_name.slice(filter_index, key_name.length);
        return `&${field}=${activeForm[key_name]}`;
      }),
      filter(key_name => activeForm[key_name] && (key_name.indexOf('filter_') !== -1)),
    )(Object.keys(activeForm));

    const secondaryQueryString = compose(
      reduce((acc, value) => acc + value, this.props.SecondaryCsvEndpoint),
      map((key_name) => {
        const filter_index = key_name.indexOf('filter_') + 'filter_'.length;
        const field = key_name.slice(filter_index, key_name.length);
        return `&${field}=${activeForm[key_name]}`;
      }),
      filter(key_name => activeForm[key_name] && (key_name.indexOf('filter_') !== -1)),
    )(Object.keys(activeForm));

    const advancedSearchDropdowns = this.props && this.props.advancedSearch &&
      (map((field) => {
        return (
          <div className="col-sm-6 form-group" key={field.filterField}>
            <div className="col-sm-4 col-xs-12">
                <label htmlFor={field.filterField} className="form-label">{field.displayName}</label>
            </div>
            <div className="col-sm-8 col-xs-12">
              <select
                className="form-control dropdownFilters"
                onChange={() => onFilter(this[field.displayName])}
                ref={(input) => { this[field.displayName] = input; }}
                name={field.filterField}
                value={path(['searchParams', page, field.filterField], search) || ""}
              >
                <option value="">
                  Select {field.displayName}
                </option>
                {field && field.list && map((option_item) => {
                  return (
                    <option key={`${option_item.id}_${option_item.name}`} value={option_item.id} >
                      {option_item.name}
                    </option>
                  );
                })(field.list)}
              </select>
            </div>
          </div>
        );
      })(this.props.advancedSearch));

    return (
      <div>
        <div className="row search-box">
          <form onChange={onSearchTextChange('filter_search')} className="col-sm-10 col-sm-offset-1" >
            <fieldset>
              <div className="col-sm-2 col-xs-12">
                <label htmlFor="query" className="form-label">Search</label>
              </div>
              <div className="col-sm-10 col-xs-12">
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Enter ${this.props.currentPage} search...`}
                  id="query"
                  value={path(['searchParams', page, 'text'], search) || ''}
                  aria-label={`Enter ${this.props.currentPage} search...`}
                />
              </div>
            </fieldset>
          </form>
        </div>
        <div className="row">
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
              <div role="tab" id="headingAdvancedSearch" className="text-center">
                <button className="btn btn-link" onClick={clearFilters}>Clear All Search Filters</button>
              </div>
              ) : (
                <div
                  role="tab"
                  id="headingAdvancedSearch"
                  className="advanced-search__button-link"
                >
                  <button className="btn btn-link" onClick={advancedSearchPopulation}>Advanced Search</button>
                  <button 
                    className="btn btn-link"
                    onClick={clearFilters} 
                  >
                    Clear Search
                  </button>
                </div>
              )
            }
          </a>
        </div>
        <div
          id="AdvancedSearch"
          className="collapse row"
          aria-labelledby="#headingAdvancedSearch"
        >
          <div className="col-xs-12 text-center">
            <div className="row">
                {advancedSearchDropdowns}
            </div>
            {this.props.dateFilters &&
              <div className="row">
                <div className="col-sm-12">
                  <div className="col-sm-6"
                    onChange={() => onFilter('filter_starting_date')} 
                  >
                    <FormGroup 
                      label="* Starting Date" 
                      id="filter_starting_date"
                    >
                      <input 
                        className="form-control" 
                        placeholder="Date Format YYYY-MM-DD" 
                        type="date" 
                      />
                    </FormGroup>
                  </div>
                  <div className="col-sm-6"
                    onChange={() => onFilter('filter_ending_date')} 
                  >
                    <FormGroup 
                      label="* Ending Date" 
                      id="filter_ending_date"
                    >
                      <input 
                        className="form-control" 
                        placeholder="Date Format YYYY-MM-DD" 
                        type="date"
                      />
                    </FormGroup>
                  </div>
                </div>
              </div>
            }
            {
              !!currentUser
              && (currentUser.is_superuser
              || (
                currentUser.profile
                && currentUser.profile.is_supervisor
              )) &&
              <div className="row">
                <div className="col-sm-6">
                  <input
                    id="filter_showDeleted"
                    className="show-deleted-box"
                    type="checkbox"
                    onClick={() => {
                      this.setState({filter_showDeleted: !filter_showDeleted})
                      toggleShowDeleted(this.state.filter_showDeleted)
                    }}
                  />
                  <label htmlFor="filter_showDeleted">
                    Show Deleted Entries
                  </label>
                </div>
              </div>
            }
          </div>
        </div>
        { this.props.csvEndpoint &&
          <div className="row">
            <div className="col-xs-12 text-center">
              <a href={`${queryString}`} className="btn button-modal-link" aria-label="Generate CSV from Current Results">
                <i className="fa fa-download button-modal-icon" aria-hidden="true" />&nbsp;Generate CSV from Current Results
              </a>
              {!!currentUser && currentUser.is_superuser &&
                <a href={`${secondaryQueryString}`} className="btn button-modal-link" aria-label="Admin CSV Export">
                  <i className="fa fa-download button-modal-icon" aria-hidden="true" />&nbsp;Admin CSV Export
                </a>
              }
            </div>
          </div>
        }
      </div>
    );
  }
}

SearchBar.propTypes = {
  // State
  activeForm: PropTypes.object,
  currentUser: PropTypes.object,
  search: PropTypes.object,
  // Functions
  advancedSearchPopulation: PropTypes.func,
  clearFilters: PropTypes.func,
  onComponentDidMount: PropTypes.func,
  onFilter: PropTypes.func,
  onSearchTextChange: PropTypes.func,
  toggleShowDeleted: PropTypes.func,
  // Params
  apiCalls: PropTypes.array,
  advancedSearch: PropTypes.array,
  csvEndpoint: PropTypes.string,
  currentPage: PropTypes.string,
  dateFilters: PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    activeForm: state.activeForm,
    currentUser: state.currentUser,
    search: state.search,
  };
}

function mapDispatchToProps(dispatch, props) {
  return {
    onComponentDidMount() {
      dispatch(formUpdate({ filterToggle: false }));
      dispatch(searchQuery());
    },
    onSearchTextChange(field) {
      return (e, ...args) => {
        if (e.keyCode != 13) {
          const value = typeof e.target.value !== 'undefined' ? e.target.value : args[1];
          const update = {
            [field]: value,
          };

          dispatch(formUpdate(update));
          dispatch(updateSearch({
            page: props.currentPage,
            text: e.target.value,
          }));
          dispatch(searchQuery());
        }
      };
    },
    onFilter(field) {
      if (field !== 'filter_ending_date' || field !== 'filter_starting_date') {
        const update = {
          [field.name]: field.value,
        };
        dispatch(formUpdate(update));
        dispatch(updateSearch({
          page: props.currentPage,
          [field.name]: field.value,
        }));
      }
      dispatch(searchQuery());
    },
    advancedSearchPopulation() {
      dispatch(formUpdate({ filterToggle: true }));
      (map((apiFunction) => {
        dispatch(apiFunction());
      })(props.apiCalls));
    },
    clearFilters() {
      dispatch(clearSearch({
        page: props.currentPage,
      }));
      dispatch(formReset());
      dispatch(formUpdate({ filterToggle: false }));
      dispatch(getPagination());
    },
    toggleShowDeleted(prevState) {
      dispatch(formUpdate({filter_showDeleted: toString(!prevState.filter_showDeleted)}));
      dispatch(searchQuery());
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
