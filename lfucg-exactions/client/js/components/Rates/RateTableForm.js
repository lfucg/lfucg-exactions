import React from 'react';
import { connect } from 'react-redux';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import Navbar from '../Navbar';
import Footer from '../Footer';
import Breadcrumbs from '../Breadcrumbs';
import RateCategoryTable from './RateCategoryTable';
import RateTableExisting from './RateTableExisting';

import {
    clearRates,
} from '../../actions/formActions';

import {
    getRates,
} from '../../actions/apiActions';

class RateTableForm extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            rates,
            route,
            selectedRateTable,
        } = this.props;

        const CATEGORIES = ['ROADS', 'OPEN_SPACE', 'SEWER_CAP', 'SEWER_TRANS', 'PARK', 'STORM_WATER'];

        const category_chart = map((category, index) => {
            return (
                <div key={index}>
                    <RateCategoryTable
                      category={category}
                      selectedRateTable={selectedRateTable}
                    />
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
                        <RateTableExisting selectedRateTable={selectedRateTable} />
                        <div className="clearfix" />
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
    rates: PropTypes.object,
    route: PropTypes.object,
    onComponentDidMount: PropTypes.func,
    selectedRateTable: PropTypes.string,
};

function mapStateToProps(state) {
    return {
        rates: state.rates,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedRateTable = params.params.id;
    return {
        onComponentDidMount() {
            dispatch(clearRates());
            if (selectedRateTable) {
                dispatch(getRates(selectedRateTable));
            }
        },
        selectedRateTable,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RateTableForm);
