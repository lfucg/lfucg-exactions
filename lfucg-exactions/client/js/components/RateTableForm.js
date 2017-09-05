import React from 'react';
import { connect } from 'react-redux';
import { map } from 'ramda';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

import FormGroup from './FormGroup';

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

        const subdivisionsList = subdivisions.length > 0 &&
            (map((single_subdivision) => {
                return (
                    <option key={single_subdivision.id} value={[single_subdivision.id, single_subdivision.name]} >
                        {single_subdivision.name}
                    </option>
                );
            })(subdivisions));

        return (
            <div className="plat-form">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>PLATS - CREATE / APPLY</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'plat'} parent_name={'Plats'} />

                <div className="inside-body">
                    <div className="container">
                        hello
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

RateTableForm.propsTypes = {
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
            dispatch(getRates());
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RateTableForm);
