import React from 'react';
import { connect } from 'react-redux';

import Navbar from './Navbar';
import Footer from './Footer';

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
                </div>
                <Footer />
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

