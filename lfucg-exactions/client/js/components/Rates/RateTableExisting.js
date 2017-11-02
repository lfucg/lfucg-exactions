import React from 'react';
import { connect } from 'react-redux';
import { map, filter } from 'ramda';
import PropTypes from 'prop-types';

import { hashHistory } from 'react-router';
import FormGroup from './../FormGroup';

import {
    formUpdate,
    clearRates,
} from '../../actions/formActions';

import {
    getRateTables,
    getRateTableID,
    postRateTable,
    putRateTable,
    putRateTableActive,
    getRates,
} from '../../actions/apiActions';

class RateTableForm extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            route,
            activeForm,
            onRateTableSelection,
            selectedRateTable,
            onRateTableForm,
            onSubmitTable,
            onActiveTableSelection,
        } = this.props;

        const existing_tables = activeForm && activeForm.rate_tables &&
            map((table) => {
                return (
                    <option key={table.id} value={table.id}>
                        {table.resolution_number}
                    </option>
                );
            })(activeForm.rate_tables);

        const currentTable = activeForm && activeForm.rate_tables && selectedRateTable &&
            filter(tableSelect => tableSelect.id === Number(selectedRateTable))(activeForm.rate_tables)[0];

        const activeRateTable = activeForm && activeForm.rate_tables &&
            filter(tableSelect => tableSelect.is_active === true)(activeForm.rate_tables)[0];

        const submitEnabled =
            activeForm.resolution_number &&
            activeForm.begin_effective_date &&
            activeForm.end_effective_date;

        return (
            <div className="existing-rate-table">
                <h3 className="col-xs-5 inline-label">Currently Active Table</h3>
                <h5 className="col-xs-4 inline-label">*(Only one table may be active at a time.)</h5>
                <div className="form-group col-xs-3">
                    <select id="active_table" className="form-control" onChange={onActiveTableSelection('active_table')}>
                        {activeRateTable &&
                            <option value={activeRateTable.id} >Currently: {activeRateTable.resolution_number}</option>
                        }
                        {existing_tables}
                    </select>
                </div>
                <div className="clearfix" />
                <h3 className="col-xs-4 col-sm-3 inline-label">Rate Table</h3>
                <div className="form-group col-xs-4 col-sm-3 ">
                    <select id="rate_table_id" className="form-control" onChange={onRateTableSelection('rate_table_id')}>
                        {currentTable ?
                            <option value={currentTable.id} >{currentTable.resolution_number}</option>
                            : <option value="start_table">Rate Table</option>
                        }
                        <option value="new_table">New Table</option>
                        {existing_tables}
                    </select>
                </div>
                {currentTable ? <div>
                    <div className="col-xs-6 col-sm-3">
                        <h4>Start: {currentTable.begin_effective_date}</h4>
                    </div>
                    <div className="col-xs-6 col-sm-3">
                        <h4>End: {currentTable.end_effective_date}</h4>
                    </div>
                    <div className="row">
                        <button className="btn btn-primary col-xs-3 col-xs-offset-8" onClick={onRateTableForm} >Edit Rate Table</button>
                    </div>
                </div> : <button className="btn btn-primary col-xs-6 col-sm-3 col-sm-offset-3" onClick={onRateTableForm}>Create a new rate table</button>}
                { activeForm && activeForm.editRateTable && <div className="row">
                    <div className="clearfix" />
                    <form>
                        <div className="row form-subheading">
                            <h3>Create New Rate Table</h3>
                        </div>
                        <div className="row">
                            <div className="col-xs-6">
                                <FormGroup label="* Resolution Number" id="resolution_number" aria-required="true">
                                    <input type="text" className="form-control" placeholder="Resolution Number" />
                                </FormGroup>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-6">
                                <FormGroup label="* Start Date" id="begin_effective_date" aria-required="true">
                                    <input type="date" className="form-control" placeholder="Start Date Format YYYY-MM-DD" />
                                </FormGroup>
                            </div>
                            <div className="col-xs-6">
                                <FormGroup label="* End Date" id="end_effective_date" aria-required="true">
                                    <input type="date" className="form-control" placeholder="End Date Format YYYY-MM-DD" />
                                </FormGroup>
                            </div>
                        </div>
                        { submitEnabled ? <button className="btn btn-lex" onClick={onSubmitTable}>
                            Submit
                        </button> : <div>
                            <div className="clearfix" />
                            <span> * All required fields must be filled.</span>
                        </div>}
                    </form>
                    <div className="clearfix" />
                </div>}
            </div>
        );
    }
}

RateTableForm.propTypes = {
    activeForm: PropTypes.object,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
    onRateTableSelection: PropTypes.func,
    onRateTableForm: PropTypes.func,
    onSubmitTable: PropTypes.func,
    onActiveTableSelection: PropTypes.func,
    selectedRateTable: PropTypes.string,
};

function mapStateToProps(state) {
    return {
        activeForm: state.activeForm,
    };
}

function mapDispatchToProps(dispatch, props) {
    return {
        onComponentDidMount() {
            dispatch(getRateTables())
            .then((rate_tables) => {
                dispatch(formUpdate({ rate_tables: rate_tables.response, editRateTable: false }));
            });
        },
        onRateTableSelection() {
            return (e, ...args) => {
                const value = typeof e.target.value !== 'undefined' ? e.target.value : args[1];
                if (value === 'new_table') {
                    dispatch(clearRates());
                    dispatch(formUpdate({ editRateTable: true }));
                    hashHistory.push('rate-table/form/');
                } else {
                    dispatch(getRates(value));
                    hashHistory.push(`rate-table/form/${value}`);
                }
            };
        },
        onRateTableForm() {
            if (props.selectedRateTable) {
                dispatch(getRateTableID(props.selectedRateTable))
                    .then((table) => {
                        const table_update = {
                            resolution_number: table.response.resolution_number,
                            begin_effective_date: table.response.begin_effective_date,
                            end_effective_date: table.response.end_effective_date,
                        };
                        dispatch(formUpdate(table_update));
                    });
            }
            dispatch(formUpdate({ editRateTable: true }));
        },
        onSubmitTable() {
            dispatch(formUpdate({ editRateTable: false }));
            if (props.selectedRateTable) {
                dispatch(putRateTable(props.selectedRateTable));
                dispatch(getRateTables());
            } else {
                dispatch(postRateTable());
                dispatch(getRateTables());
            }
        },
        onActiveTableSelection() {
            return (e, ...args) => {
                const value = typeof e.target.value !== 'undefined' ? e.target.value : args[1];
                dispatch(putRateTableActive(value));
            };
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RateTableForm);
