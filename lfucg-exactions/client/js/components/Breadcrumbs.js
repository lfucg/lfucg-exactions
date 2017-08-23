import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Breadcrumbs extends React.Component {
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

Breadcrumbs.propTypes = {
    route: PropTypes.object,
};

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Breadcrumbs);
