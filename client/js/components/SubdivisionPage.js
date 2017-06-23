import React from 'react';
import { connect } from 'react-redux';
import { map } from 'ramda';

import Navbar from './Navbar';
import Footer from './Footer';

import {
    getSubdivisions,
} from '../actions/apiActions';

class SubdivisionPage extends React.Component {
    static propTypes = {
        subdivisions: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
    };

    componentDidMount() {
        this.props.onComponentDidMount();
    }


    render() {
        const {
            subdivisions,
        } = this.props;

        const subdivisions_list = subdivisions.length > 0 ? (
            map((subdivision) => {
                return (
                    <div key={subdivision.id} className="col-xs-12">
                        <div className="row">
                            <h4>{subdivision.name}</h4>
                        </div>
                        <div className="row">
                            <p className="col-md-3 col-sm-offset-1 col-sm-4 col-xs-6">Acres: {subdivision.gross_acreage}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Lots: {subdivision.number_allowed_lots}</p>
                        </div>
                    </div>
                );
            })(subdivisions)
        ) : null;

        return (
            <div className="dashboard">
                <Navbar />
                <img src={`${global.BASE_STATIC_URL}/lexington-hero-interior.jpg`} role="presentation" className="lex-banner" />
                <div className="container">
                    <h1>SUBDIVISIONS</h1>
                    {subdivisions_list}
                </div>
                <Footer />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        subdivisions: state.subdivisions,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(getSubdivisions());
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(SubdivisionPage);

