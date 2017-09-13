import React from 'react';
import { connect } from 'react-redux';
import { map } from 'ramda';
import PropTypes from 'prop-types';

// import {
//     formInit,
//     formUpdate,
// } from '../actions/formActions';

// import {
//     getRates,
// } from '../actions/apiActions';

class RateZoneRow extends React.Component {
    // componentDidMount() {
    //     this.props.onComponentDidMount({
    //         category: this.props.category,
    //         zone: this.props.zone,
    //     });
    // }

    render() {
        const {
            activeForm,
            onRateChange,
        } = this.props;

        const EXPANSION_AREAS = ['EA-1', 'EA-2A', 'EA-2B', 'EA-2C', 'EA-3'];

        const expansion_area_list = map((expansion, index) => {
            return (
                <td key={index}>
                    <input
                      type="number"
                      step="2"
                      className="form-control"
                      value={[this.props.category, this.props.zone, expansion]}
                      onBlur={onRateChange}
                    />
                </td>
            );
        })(EXPANSION_AREAS);

        return (
            <div className="rate-zone">
                <tr>
                    <th scope="row">{this.props.zone}</th>
                    {expansion_area_list && expansion_area_list}
                </tr>
            </div>
        );
    }
}

RateZoneRow.propTypes = {
    activeForm: PropTypes.object,
    // onComponentDidMount: PropTypes.func,
    onRateChange: PropTypes.func,
    category: PropTypes.string,
    zone: PropTypes.string,
};

function mapStateToProps(state) {
    return {
        activeForm: state.activeForm,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onRateChange() {
            console.log('INSIDE RATE CHANGE');
        },
//         onComponentDidMount() {
            // dispatch(formInit());
            // dispatch(getRates())
            // .then((data_rate) => {
            //     // const all_results = data_rate.response;
            //     // console.log('ALL RESULTS', all_results);
            //     const rate_update = {
            //         all_results: data_rate.response,
            //     };
            //     dispatch(formUpdate(rate_update));
            // });
        // },

        // onSubmit(activeForm) {
        //     return (e, ...args) => {
        //         const field_name = typeof e.target.id !== 'undefined' ? e.target.id : args[1];
        //         const value = typeof e.target.value !== 'undefined' ? e.target.value : args[1];
        //         const update = {
        //             [field_name]: value,
        //         };
        //         dispatch(formUpdate(update));
        //     };
        // },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RateZoneRow);
