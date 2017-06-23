import React from 'react';
import { connect } from 'react-redux';

import { formUpdate } from '../actions/formActions';

const FormGroup = ({
    children,
    label,
    id,
    activeForm,
    formChange,
}) => {
    return (
        <div className="form-group">
            <label htmlFor={id} className="form-label" aria-label={label} >{label}</label>
            {
                React.cloneElement(
                    children,
                    {
                        id,
                        value: activeForm[id] || '',
                        onChange: formChange(id),
                    },
                )
            }
        </div>
    );
};

FormGroup.propTypes = {
    children: React.PropTypes.element.isRequired,
    label: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired,
    activeForm: React.PropTypes.object.isRequired,
    formChange: React.PropTypes.func.isRequired,
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
    };
};


export default connect(mapState, mapDispatch)(FormGroup);
