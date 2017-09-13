import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { formUpdate } from '../actions/formActions';

const RateFormGroup = ({
    children,
    id,
    activeForm,
    formChange,
}) => {
    return (
        <div className="form-group">
            {
                React.cloneElement(
                    children,
                    {
                        id,
                        // this.props.category,
                        // this.props.zone,
                        // this.props.expansion,
                        value: activeForm[id] || '',
                        onChange: formChange(id),
                    },
                )
            }
        </div>
    );
};

RateFormGroup.propTypes = {
    children: PropTypes.element.isRequired,
    // label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    activeForm: PropTypes.object.isRequired,
    formChange: PropTypes.func.isRequired,
    category: PropTypes.string,
    zone: PropTypes.string,
    expansion: PropTypes.string,
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
                console.log('INSIDE FORM CHANGE', field);
                console.log('E TARGET', e.target);
                const value = typeof e.target.value !== 'undefined' ? e.target.value : args[1];
                const update = {
                    [field]: value,
                };
                console.log('INSIDE RETURN', value);
                dispatch(formUpdate(update));
            };
        },
    };
};


export default connect(mapState, mapDispatch)(RateFormGroup);
