import React from 'react';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import RateFormGroup from './RateFormGroup';

class RateZoneRow extends React.Component {
    render() {
        const EXPANSION_AREAS = ['EA-1', 'EA-2A', 'EA-2B', 'EA-2C', 'EA-3'];

        const expansion_area_list = map((expansion, index) => {
            return (
                <div className="col-sm-2 rate-form-group" key={index}>
                    <RateFormGroup
                      id={`${this.props.category}, ${this.props.zone}, ${expansion}`}
                      category={this.props.category}
                      zone={this.props.zone}
                      expansion={expansion}
                      value="rate"
                      selectedRateTable={this.props.selectedRateTable}
                    >
                        <input
                          type="number"
                          step="2"
                          className="form-control"
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
    category: PropTypes.string,
    zone: PropTypes.string,
    selectedRateTable: PropTypes.string,
};

export default RateZoneRow;
