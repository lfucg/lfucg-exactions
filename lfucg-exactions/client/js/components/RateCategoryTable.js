import React from 'react';
import { connect } from 'react-redux';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import {
    formInit,
    formUpdate,
} from '../actions/formActions';

import {
    getRates,
} from '../actions/apiActions';

class RateCategoryTable extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            activeForm,
        } = this.props;

        return (
            <div className="rate-table-form">


                <div className="inside-body">
                    <div className="container">
                        hello
                    </div>
                </div>
            </div>
        );
    }
}

RateCategoryTable.propsTypes = {
    activeForm: PropTypes.object,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        activeForm: state.activeForm,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(formInit());
            dispatch(getRates())
            .then((data_rate) => {
                // const all_results = data_rate.response;
                // console.log('ALL RESULTS', all_results);
                const rate_update = {
                    all_results: data_rate.response,
                };
                dispatch(formUpdate(rate_update));
            });
        },

        onSubmit(activeForm) {
            return (e, ...args) => {
                const field_name = typeof e.target.id !== 'undefined' ? e.target.id : args[1];
                const value = typeof e.target.value !== 'undefined' ? e.target.value : args[1];
                const update = {
                    [field_name]: value,
                };
                dispatch(formUpdate(update));
            };
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RateCategoryTable);
