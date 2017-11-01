import React from 'react';
import { connect } from 'react-redux';
import { map, filter } from 'ramda';
import PropTypes from 'prop-types';

import { hashHistory } from 'react-router';
import FormGroup from './../FormGroup';

import {
    formUpdate,
} from '../../actions/formActions';

import {
    getRateTables,
    postRateTable,
    putRateTable,
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

        const submitEnabled =
            activeForm.resolution_number &&
            activeForm.begin_effective_date &&
            activeForm.end_effective_date;

        return (
            <div className="existing-rate-table">
                <h3 className="col-xs-4 col-sm-3 inline-label">Rate Table</h3>
                <div className="form-group col-xs-4 col-sm-3 ">
                    <select id="rate_table_id" className="form-control" onChange={onRateTableSelection('rate_table_id')}>
                        {currentTable ?
                            <option value={currentTable.id} >{currentTable.resolution_number}</option>
                            : <option value="start_table">Rate Table</option>
                        }
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
                dispatch(formUpdate({ rate_tables: rate_tables.response }));
            });
        },
        onRateTableSelection() {
            return (e, ...args) => {
                const value = typeof e.target.value !== 'undefined' ? e.target.value : args[1];
                hashHistory.push(`rate-table/form/${value}`);
            };
        },
        onRateTableForm() {
            dispatch(formUpdate({ editRateTable: true }));
        },
        onSubmitTable() {
            if (props.selectedRateTable) {
                dispatch(putRateTable(props.selectedRateTable));
                dispatch(getRateTables());
            } else {
                dispatch(postRateTable());
            }
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RateTableForm);
