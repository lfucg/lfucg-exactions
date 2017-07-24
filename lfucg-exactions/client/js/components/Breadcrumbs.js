import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import {
    formUpdate,
} from '../actions/formActions';

class Breadcrumbs extends React.Component {
    static propTypes = {
        route: React.PropTypes.object,
    };

    render() {
        const {
            route,
        } = this.props;

        return (
            <div className="breadcrumb">
                <div className="container">
                    <h4>
                        <Link to="/" role="link">Home</Link>
                        <span> / </span>
                        {this.props.parent_link &&
                            <span>
                                <Link to={this.props.parent_link} role="link">{this.props.parent_name}</Link>
                                <span> / </span>
                            </span>
                        }
                        <Link to={route.path}>{route.name}</Link>
                        <span> / </span>
                    </h4>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch, route) {
    return {
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Breadcrumbs);
