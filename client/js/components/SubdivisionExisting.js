import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { map } from 'ramda';

import Navbar from './Navbar';
import Footer from './Footer';

import {
    getSubdivisions,
} from '../actions/apiActions';

class SubdivisionExisting extends React.Component {
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
                        <div className="row form-subheading">
                            <h3>{subdivision.name}</h3>
                        </div>
                        <div className="row">
                            <p className="col-md-3 col-sm-offset-1 col-sm-4 col-xs-6">Acres: {subdivision.cleaned_gross_acreage}</p>
                            <p className="col-md-3 col-sm-4 col-xs-6">Lots: {subdivision.number_allowed_lots}</p>
                        </div>
                    </div>
                );
            })(subdivisions)
        ) : null;

        return (
            <div className="subdivision-existing">
                <Navbar />

                <div className="form-header">
                    <div className="container">
                        <div className="col-sm-9">
                            <h1>SUBDIVISIONS - EXISTING</h1>
                        </div>
                        <div className="col-sm-3">
                            <Link to="subdivision-page" className="btn btn-lex-reverse" role="link">Return to Subdivisions</Link>
                        </div>
                    </div>
                </div>
                <div className="inside-body">
                    <div className="container">
                        {subdivisions_list}
                    </div>
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


export default connect(mapStateToProps, mapDispatchToProps)(SubdivisionExisting);

