import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

import {
    getPlatID,
} from '../actions/apiActions';

import {
    formUpdate,
} from '../actions/formActions';

class PlatExisting extends React.Component {
    static propTypes = {
        plats: React.PropTypes.object,
        route: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
    };

    componentDidMount() {
        this.props.onComponentDidMount();
    }


    render() {
        const {
            plats,
            onPlatQuery,
        } = this.props;

        return (
            <div className="plat-existing">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <h1>PLATS - EXISTING</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} parent_link={'plat'} parent_name={'Plats'} />

                <div className="inside-body">
                    <div className="container">
                        
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        plats: state.plats,
    };
}

function mapDispatchToProps(dispatch, params) {
    const selectedPlat = params.params.id;

    return {
        onComponentDidMount() {
            dispatch(getPlatID(selectedPlat));
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(PlatExisting);
