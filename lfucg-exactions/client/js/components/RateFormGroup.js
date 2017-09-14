import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { formUpdate } from '../actions/formActions';

import {
    postRate,
    putRate,
} from '../actions/apiActions';

const RateFormGroup = ({
    children,
    activeForm,
    id,
    category,
    zone,
    expansion,
    formChange,
    rateChangeSubmit,
}) => {
    return (
        <div className="form-group">
            {
                React.cloneElement(
                    children,
                    {
                        id,
                        category,
                        zone,
                        expansion,
                        value: activeForm[id] || '',
                        onChange: formChange(id),
                        onBlur: rateChangeSubmit(id),
                    },
                )
            }
        </div>
    );
};

RateFormGroup.propTypes = {
    children: PropTypes.element.isRequired,
    activeForm: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    category: PropTypes.string,
    zone: PropTypes.string,
    expansion: PropTypes.string,
    formChange: PropTypes.func.isRequired,
    rateChangeSubmit: PropTypes.func,
};

const mapState = ({ activeForm }) => {
    return {
        activeForm,
    };
};

const mapDispatch = (dispatch) => {
    return {
        formChange(field) {
            return (e, ...args) => {
                const value = typeof e.target.value !== 'undefined' ? e.target.value : args[1];
                const update = {
                    [field]: value,
                };
                dispatch(formUpdate(update));
            };
        },
        rateChangeSubmit(field) {
            return (e, ...args) => {
                const split_field = field.split(', ');

                const rate_table_id = 2;

                const category = split_field[0];
                const zone = split_field[1];
                const expansion_area = split_field[2];

                const rate = typeof e.target.value !== 'undefined' ? e.target.value : args[1];

                if (rate.length > 0) {
                    dispatch(postRate(rate_table_id, category, zone, expansion_area, rate));
                }
            };
        },
    };
};


export default connect(mapState, mapDispatch)(RateFormGroup);
