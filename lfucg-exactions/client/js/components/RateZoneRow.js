import React from 'react';
import { connect } from 'react-redux';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import {
    formInit,
    formUpdate,
} from '../actions/formActions';

// import {
//     getRates,
// } from '../actions/apiActions';

import RateFormGroup from './RateFormGroup';

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
            // onRateChange,
        } = this.props;

        const EXPANSION_AREAS = ['EA-1', 'EA-2A', 'EA-2B', 'EA-2C', 'EA-3'];

        const expansion_area_list = map((expansion, index) => {
            return (
                <div className="col-sm-2" key={index}>
                    <RateFormGroup
                      // id="rate"
                      // id={{
                      //     category: this.props.category,
                      //     zone: this.props.zone,
                      //     expansion,
                      //     rate: <input type="number" step="2" className="form-control" />,
                      // }}
                      // id={(rate = 'rate') =>
                      //     // category + zone + expansion + rate
                      //     [this.props.category, this.props.zone, expansion, rate]
                      // }
                      // id={[this.props.category, this.props.zone, expansion, 'rate']}
                      id={`${this.props.category}, ${this.props.zone}, ${expansion}`}
                      category={this.props.category}
                      zone={this.props.zone}
                      expansion={expansion}
                      value="rate"
                    >
                        <input
                          type="number"
                          step="2"
                          className="form-control"
                          // id="rate"
                          // onBlur={onRateChange()}
                          // value="rate"
                        />
                    </RateFormGroup>
                </div>
            );
        })(EXPANSION_AREAS);

        return (
            <div className="rate-zone">
                <div className="row">
                    <h4 className="col-sm-2">{this.props.zone}</h4>
                    <div className="col-sm-10">
                        {expansion_area_list && expansion_area_list}
                    </div>
                </div>
            </div>
        );
    }
}

RateZoneRow.propTypes = {
    activeForm: PropTypes.object,
    // onComponentDidMount: PropTypes.func,
    // onRateChange: PropTypes.func,
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
        onRateChange(field) {
            console.log('INSIDE RATE CHANGE');
            console.log('FIELD TOP');
            return (e, ...args) => {
                console.log('FIELD', field);
                const value = typeof e.target.value !== 'undefined' ? e.target.value : args[1];
                const update = {
                    [field]: value,
                };
                console.log('VALUE', value);
                dispatch(formUpdate(update));
            };
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
