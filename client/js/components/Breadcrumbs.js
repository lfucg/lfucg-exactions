import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import {
    formUpdate,
} from '../actions/formActions';

class Breadcrumbs extends React.Component {
    static propTypes = {
        activeForm: React.PropTypes.object,
        parent_link: React.PropTypes.string,
        parent_name: React.PropTypes.string,
        onComponentDidMount: React.PropTypes.func,
    };

    componentDidMount() {
        setTimeout(() => {
            this.props.onComponentDidMount({
                parent_link: this.props.parent_link,
                parent_name: this.props.parent_name,
            });
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
                        {activeForm.parent_link &&
                            <span>
                                <Link to={activeForm.parent_link} role="link">{activeForm.parent_name}</Link>
                                <span> / </span>
                            </span>
                        }
                        <Link to={current_link}>{current_name}</Link>
                        <span> / </span>
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
        onComponentDidMount(pass_props) {
            const update = {
                current_link: location_url,
                current_name: location_name,
                parent_link: pass_props.parent_link,
                parent_name: pass_props.parent_name,
            };
            dispatch(formUpdate(update));
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Breadcrumbs);
