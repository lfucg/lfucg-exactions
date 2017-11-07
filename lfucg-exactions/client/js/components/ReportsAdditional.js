import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import FormGroup from './FormGroup';

import {
    formUpdate,
} from '../actions/formActions';

class ReportsAdditional extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount({
        });
    }

    render() {
        const {
            activeForm,
            route,
            onReportChange,
        } = this.props;

        return (
            <div className="row reports-additional">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>ADDITIONAL REPORTS</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} />
                <div className="inside-body">
                    <div className="container">
                        <form onChange={onReportChange}>
                            <div className="col-sm-3"><h3>Transaction Report</h3></div>
                            <div className="col-sm-3">
                                <FormGroup label="* Starting Date" id="starting_date" aria-required="true" >
                                    <input type="date" className="form-control" placeholder="Date Format YYYY-MM-DD" />
                                </FormGroup>
                            </div>
                            <div className="col-sm-3">
                                <FormGroup label="* Ending Date" id="ending_date" aria-required="true" >
                                    <input type="date" className="form-control" placeholder="Date Format YYYY-MM-DD" />
                                </FormGroup>
                            </div>
                            <div className="col-sm-3">
                                <a
                                  className="btn btn-lex"
                                  disabled={!activeForm.starting_date || !activeForm.ending_date}
                                  href={`../api/transactions_csv/?starting_date=${activeForm.starting_date}&ending_date=${activeForm.ending_date}`}
                                >Transaction CSV</a>
                            </div>
                        </form>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

ReportsAdditional.propTypes = {
    activeForm: PropTypes.object,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
    onReportChange: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        activeForm: state.activeForm,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
        },
        onReportChange(field) {
            return (e, ...args) => {
                const value = typeof e.target.value !== 'undefined' ? e.target.value : args[1];
                const update = {
                    [field]: value,
                };
                dispatch(formUpdate(update));
            };
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(ReportsAdditional);
