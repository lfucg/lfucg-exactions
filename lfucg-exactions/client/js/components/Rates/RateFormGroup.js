import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { formUpdate } from '../../actions/formActions';

import {
    postRate,
    putRate,
} from '../../actions/apiActions';

const RateFormGroup = ({
    children,
    rates,
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
                        value: (activeForm && activeForm[id] ? activeForm[id] : ((rates && rates[0] && rates[0][id].rate) ? rates[0][id].rate : '')),
                        onChange: formChange(id),
                        onBlur: (rates && rates[0] ? rateChangeSubmit({ existing: rates[0][id], rate: activeForm[id], id }) : rateChangeSubmit({ rate: activeForm[id], id })),
                    },
                )
            }
        </div>
    );
};

RateFormGroup.propTypes = {
    children: PropTypes.element.isRequired,
    rates: PropTypes.array,
    activeForm: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    category: PropTypes.string,
    zone: PropTypes.string,
    expansion: PropTypes.string,
    formChange: PropTypes.func.isRequired,
    rateChangeSubmit: PropTypes.func,
};

function mapState(state) {
    return {
        activeForm: state.activeForm,
        rates: state.rates,
    };
}

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
            return () => {
                if (field.existing) {
                    const rate = field.rate;
                    const selectedRate = field.existing.id;

                    dispatch(putRate(selectedRate, rate));
                } else {
                    const split_field = field.id.split(', ');

                    const rate_table_id = 2;

                    const category = split_field[0];
                    const zone = split_field[1];
                    const expansion_area = split_field[2];

                    const rate = field.rate;

                    dispatch(postRate(rate_table_id, category, zone, expansion_area, rate));
                }
                console.log('FIELD', field);
            };
        },
    };
};


export default connect(mapState, mapDispatch)(RateFormGroup);
