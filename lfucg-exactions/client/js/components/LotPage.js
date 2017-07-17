import React from 'react';
import { connect } from 'react-redux';
import {
    Link,
} from 'react-router';

import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

class LotPage extends React.Component {
    static propTypes = {
        route: React.PropTypes.object,
    };

    render() {
        const {
        } = this.props;

        return (
            <div className="lot-page">
                <Navbar />
                <div className="form-header">
                    <div className="container">
                        <h1>LOTS</h1>
                    </div>
                </div>

                <Breadcrumbs route={this.props.route} />

                <div className="inside-body">
                    <div className="container">
                        <div className="col-xs-12">
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="row">
                                        <Link to={'lot/form'} role="link" ><h2 className="in-page-link">Create Lot</h2></Link>
                                    </div>
                                    <div className="row">
                                        <p>Apply for approval of a new lot.</p>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="row">
                                        <Link to={'lot/existing'} role="link" ><h2 className="in-page-link">Existing Lots</h2></Link>
                                    </div>
                                    <div className="row">
                                        <p>View existing or developing lots.</p>
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


export default connect(mapStateToProps, mapDispatchToProps)(LotPage);

