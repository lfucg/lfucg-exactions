import React from 'react';
import { connect } from 'react-redux';
import {
    Link,
} from 'react-router';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

class PlatPage extends React.Component {
    static propTypes = {
        route: React.PropTypes.object,
    };

    render() {
        const {
        } = this.props;

        return (
            <div className="plat-page">
                <Navbar />
                <div className="form-header">
                    <div className="container">
                        <h1>Plats</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} />

                <div className="inside-body">
                    <div className="container">
                        <div className="col-xs-12">
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="row">
                                        <Link to={'plat/form/'} role="link" ><h2 className="in-page-link">Create Plat</h2></Link>
                                    </div>
                                    <div className="row">
                                        <p>Apply for approval of a new plat.</p>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="row">
                                        <Link to={'plat/existing/'} role="link" ><h2 className="in-page-link">Existing Plats</h2></Link>
                                    </div>
                                    <div className="row">
                                        <p>View existing or developing plats.</p>
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


export default connect(mapStateToProps, mapDispatchToProps)(PlatPage);

