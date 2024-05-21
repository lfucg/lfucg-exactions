import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Breadcrumbs extends React.Component {
    render() {
        const {
            currentUser,
            route,
        } = this.props;

        const route_permission = this.props.route_permission;

        return (
            <div className="breadcrumb">
                <div className="container">
                    <div className={route.name && (route.name.indexOf('Existing') > -1) ? 'col-xs-8 col-md-9' : 'col-xs-12'}>
                        <h4>
                            <Link to="/" role="link">Home</Link>
                            <span aria-hidden="true"> / </span>
                            {this.props.parent_link &&
                                <span>
                                    <Link to={this.props.parent_link} role="link">{this.props.parent_name}</Link>
                                    <span aria-hidden="true"> / </span>
                                </span>
                            }
                            <Link to={route.path}>{route.name}</Link>
                            <span aria-hidden="true"> / </span>
                        </h4>
                    </div>
                    {route.name && (route.name.indexOf('Existing') > -1) &&
                        <div className="col-xs-4 col-md-3">
                            {currentUser && currentUser.permissions && route_permission in currentUser.permissions &&
                                <Link className="create-link" to={`${route.path}/form/`} aria-label="Create">
                                    <i className="fa fa-plus-square col-xs-4 col-sm-2 col-xs-offset-1 create-icon" aria-hidden="true" />
                                    <div className="col-xs-7 col-sm-9 create-label">
                                        Create
                                    </div>
                                </Link>
                            }
                        </div>
                    }
                </div>
            </div>
        );
    }
}

Breadcrumbs.propTypes = {
    currentUser: PropTypes.object,
    route: PropTypes.object,
    route_permission: PropTypes.string,
    parent_link: PropTypes.string,
    parent_name: PropTypes.string,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
    };
}

export default connect(mapStateToProps)(Breadcrumbs);
