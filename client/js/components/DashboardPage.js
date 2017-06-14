import React from 'react';
import { connect } from 'react-redux';

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
                Hello World ... Now from React/Redux!
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

