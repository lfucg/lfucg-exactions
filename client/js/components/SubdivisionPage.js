import React from 'react';
import { connect } from 'react-redux';
import {
    Link,
} from 'react-router';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

class SubdivisionPage extends React.Component {
    static propTypes = {
        route: React.PropTypes.object,
    };

    render() {
        const {
        } = this.props;

        return (
            <div className="subdivision-page">
                <Navbar />
                <div className="form-header">
                    <div className="container">
                        <h1>SUBDIVISIONS</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} />

                <div className="inside-body">
                    <div className="container">
                        <div className="col-xs-12">
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="row">
                                        <Link to={'subdivision/form'} role="link" ><h2 className="in-page-link">Create Subdivision</h2></Link>
                                    </div>
                                    <div className="row">
                                        <p>Apply for approval of a new subdivision.</p>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="row">
                                        <Link to={'subdivision/existing'} role="link" ><h2 className="in-page-link">Existing Subdivisions</h2></Link>
                                    </div>
                                    <div className="row">
                                        <p>View existing or developing subdivisions.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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


export default connect(mapStateToProps, mapDispatchToProps)(SubdivisionPage);

