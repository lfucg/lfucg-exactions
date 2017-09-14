import React from 'react';
import { connect } from 'react-redux';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import RateCategoryTable from './RateCategoryTable';

import {
    formInit,
    formUpdate,
} from '../actions/formActions';

import {
    getRates,
} from '../actions/apiActions';

class RateTableForm extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            activeForm,
            route,
        } = this.props;

        const CATEGORIES = ['ROADS', 'OPEN_SPACE', 'SEWER_CAP', 'SEWER_TRANS', 'PARK', 'STORM_WATER'];

        const category_chart = map((category, index) => {
            return (
                <div key={index}>
                    <RateCategoryTable category={category} />
                </div>
            );
        })(CATEGORIES);

        // VALUE ORDER: RATE, ID, RATE_TABLE_ID, CATEGORY, ZONE, EXPANSION_AREA
        // const RoadEA1List = activeForm.rates.length > 0 &&
        //     (map((road_ea1) => {
        //         return (
        //             <div className="row">
        //                 <input
        //                   type="number"
        //                   step="0.01"
        //                   key={road_ea1.id}
        //                   value={[
        //                       road_ea1.rate,
        //                       road_ea1.id,
        //                       road_ea1.rate_table_id,
        //                       road_ea1.category,
        //                       road_ea1.zone,
        //                       road_ea1.expansion_area,
        //                   ]}
        //                 />
        //             </div>
        //         );
        //     })(activeForm.rates));

        return (
            <div className="rate-table-form">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>EXACTION RATE TABLE</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} />

                <div className="inside-body">
                    <div className="container">
                        {
                            // Create a new rate table
                        }
                        <div className="col-md-offset-1 col-md-10 rate-panel-group" id="accordion" role="tablist" aria-multiselectable="false">
                            {category_chart && category_chart}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

RateTableForm.propTypes = {
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
                // console.log('DATA RATE', data_rate);
                const data_rate_updates = map((rate_set) => {
                    return (
                        { id: `${rate_set.category}, ${rate_set.zone}, ${rate_set.expansion_area}`, value: rate_set.rate }
                    );
                })(data_rate.response);
                console.log('DATA RATE UPDATES', data_rate_updates);
                dispatch(formUpdate(data_rate_updates));
            });
            // .then((data_rate) => {
            //     const all_results = data_rate.response;
            //     console.log('ALL RESULTS', all_results);
            //     const rate_update = {
            //         rates: data_rate.response,
            //         rate_table_id: data_rate.response.rate_table_id,
            //     };
            //     dispatch(formUpdate(rate_update));
            // });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RateTableForm);
