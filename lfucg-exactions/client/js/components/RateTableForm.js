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
    getRateTables,
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

function mapDispatchToProps(dispatch, params) {
    const selectedRateTable = params.params.id;
    return {
        onComponentDidMount() {
            dispatch(formInit());
            // dispatch(getRateTables());
            dispatch(getRates())
            .then((data_rate) => {
                // console.log('DATA RATE', data_rate);
                const rate_ids = {};
                const data_rate_updates = map((rate_set) => {
                    return (
                        // { id: `${rate_set.category}, ${rate_set.zone}, ${rate_set.expansion_area}`, value: rate_set.rate }
                        rate_ids[`${rate_set.category}, ${rate_set.zone}, ${rate_set.expansion_area}`] = rate_set.rate
                    );
                })(data_rate.response);
                console.log('DATA RATE UPDATES', data_rate_updates);
                console.log('RATE IDS', rate_ids);
                dispatch(formUpdate(rate_ids));
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
