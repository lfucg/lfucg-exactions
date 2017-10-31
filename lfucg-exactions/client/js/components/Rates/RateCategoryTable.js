import React from 'react';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import RateZoneRow from './RateZoneRow';

class RateCategoryTable extends React.Component {
    render() {
        const ZONES = ['EAR-1', 'EAR1-SRA', 'EAR-2', 'EAR-3', 'CC(RES)', 'CC(NONR)', 'ED'];

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
                            <h4 className="col-sm-10 rate-table">Expansion Area</h4>
                        </div>
                        <div className="row">
                            <div className="col-sm-offset-2 rate-table">
                                <div className="col-sm-2">EA-1</div>
                                <div className="col-sm-2">EA-2A</div>
                                <div className="col-sm-2">EA-2B</div>
                                <div className="col-sm-2">EA-2C</div>
                                <div className="col-sm-2">EA-3</div>
                            </div>
                        </div>
                        {zone_list && zone_list}
                    </div>
                </div>
            </div>
        );
    }
}

RateCategoryTable.propTypes = {
    category: PropTypes.string,
};

export default RateCategoryTable;
