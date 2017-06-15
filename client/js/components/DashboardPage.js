import React from 'react';
import { connect } from 'react-redux';

import Navbar from './Navbar';

class DashboardPage extends React.Component {
    static propTypes = {
    };

    componentDidMount() {
    }

    render() {
        const {
        } = this.props;

        return (
            <div className="dashboard">
                <Navbar />
                <div className="container">
                    Hello World ... Now from React/Redux!
                    <div className="row">hello</div>
                    <div className="row">it is</div>
                    <div className="row">me</div>
                    <div className="row">again</div>
                    <div className="btn-primary">Button</div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);

