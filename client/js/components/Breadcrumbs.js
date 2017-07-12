import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import {
    formUpdate,
} from '../actions/formActions';

class Breadcrumbs extends React.Component {
    static propTypes = {
        activeForm: React.PropTypes.object,
        onComponentDidMount: React.PropTypes.func,
    };

    componentDidMount() {
        setTimeout(() => {
            this.props.onComponentDidMount();
        }, (Object.keys(this.props.activeForm).length > 0));
    }

    render() {
        const {
            activeForm,
        } = this.props;

        const {
            current_link,
            current_name,
        } = activeForm;

        return (
            <div className="breadcrumb">
                <div className="container">
                    <h4>
                        <Link to="/" role="link">Home</Link>
                        <span> / </span>
                        <Link to="subdivision" role="link">Subdivision</Link>
                        <span> / </span>
                        {console.log('ROUTE', this.route)}
                        <Link to={current_link}>{current_name}</Link>
                        <span> / </span>
                        {console.log('ACTIVE FORM', activeForm)}
                    </h4>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        activeForm: state.activeForm,
    };
}

function mapDispatchToProps(dispatch, route) {
    const location_url = route.route.path;
    const location_name = route.route.name;

    return {
        onComponentDidMount() {
            const update = {
                current_link: location_url,
                current_name: location_name,
            };
            dispatch(formUpdate(update));
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Breadcrumbs);
