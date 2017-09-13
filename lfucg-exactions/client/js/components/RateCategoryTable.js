import React from 'react';
import { connect } from 'react-redux';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import RateZoneRow from './RateZoneRow';

// import {
//     formInit,
//     formUpdate,
// } from '../actions/formActions';

// import {
//     getRates,
// } from '../actions/apiActions';

class RateCategoryTable extends React.Component {
    // componentDidMount() {
    //     this.props.onComponentDidMount({
    //         category: this.props.category,
    //     });
    // }

    render() {
        const {
            activeForm,
        } = this.props;

        const ZONES = ['EAR-1', 'EAR1-SRA', 'EAR-2', 'EAR-3', 'CC(RES)', 'CC(NONR)', 'ED'];
        const EXPANSION_AREAS = ['EA-1', 'EA-2A', 'EA-2B', 'EA-2C', 'EA-3'];

        const zone_list = map((zone, index) => {
            return (
                <div key={index}>
                    <RateZoneRow category={this.props.category} zone={zone} />
                </div>
            );
        })(ZONES);

        return (
            <div className="rate-table-category">
                <a
                  role="button"
                  data-toggle="collapse"
                  data-parent="#accordion"
                  href={`#category${this.props.category}`}
                  aria-expanded="true"
                  aria-controls={`category${this.props.category}`}
                >
                    <div className="row rate-panel-heading" role="tab" id={`heading${this.props.category}`}>
                        <div className="col-xs-1 caret-indicator" />
                        <div className="col-xs-10">
                            <h3>{this.props.category}</h3>
                        </div>
                    </div>
                </a>
                <div
                  id={`category${this.props.category}`}
                  className="panel-collapse collapse in row"
                  role="tabpanel"
                  aria-labelledby={`#heading${this.props.category}`}
                >
                    <div className="panel-body">
                        <div className="row">
                            <h4 className="col-sm-2">Zone</h4>
                            <h4 className="col-sm-4 col-sm-offset-2">Expansion Area</h4>
                        </div>
                        {zone_list && zone_list}
                    </div>
                </div>
            </div>
        );
    }
}

RateCategoryTable.propTypes = {
    activeForm: PropTypes.object,
    // onComponentDidMount: PropTypes.func,
    category: PropTypes.string,
};

function mapStateToProps(state) {
    return {
        activeForm: state.activeForm,
    };
}

// function mapDispatchToProps(dispatch) {
//     return {
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
//     };
// }

export default connect(mapStateToProps)(RateCategoryTable);
