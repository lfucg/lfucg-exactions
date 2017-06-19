import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

class Footer extends React.Component {

    render() {
        return (
            <div className="react-footer">
                <div className="container">
                    <div className="col-md-5 col-md-offset-1 col-sm-5">
                        <h2>
                            <a href="www.lexingtonky.gov">LEXINGTONKY.GOV</a>
                        </h2>
                    </div>
                    <div className="col-md-5  col-sm-7">
                        <div className="col-md-3 col-sm-4 footer-logo-div">
                            <img src={`${global.BASE_STATIC_URL}/Lexington_Web_White_Horse_Only.png`} role="presentation" className="white-horse-logo" />
                        </div>
                        <div className="col-md-9 col-sm-8 footer-text">
                            <div className="row">
                                © 2017 Lexington-Fayette Urban County Government
                            </div>
                            <div className="row">
                                Lexington KY, Horse Capital of the World <sup>®</sup>
                            </div>
                            <div className="row">
                                <a href="https://www.lexingtonky.gov/terms-of-use" >Terms of use</a>
                            </div>
                        </div>
                    </div>
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


export default connect(mapStateToProps, mapDispatchToProps)(Footer);
