import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class ExistingPageLinks extends React.Component {
    render() {
        const {
            currentUser,
        } = this.props;

        const modelPermission = !!currentUser && !!currentUser.permissions && currentUser.permissions[this.props.permissionModel];

        return (
            <div className="existing-page-links">
                <div className={this.props.approval ? 'row form-subheading' : 'row unapproved-heading'}>
                    <div className="col-sm-11">
                        <span>
                            <h3>
                                {this.props.title}
                                {!this.props.approval && <span className="pull-right">Approval Pending</span>}
                            </h3>
                            {!!this.props.subtitle &&
                                <h4 style={{paddingLeft: '20px'}}>
                                    {this.props.subtitle}
                                </h4>
                            }
                        </span>
                    </div>
                </div>
                <div className={this.props.approval ? 'row link-row' : 'row link-row-approval-pending'}>
                    <div className={this.props.uniqueReport ? 'col-xs-12 col-sm-7 col-sm-offset-5' : 'col-xs-12 col-sm-6 pull-right'}>
                        <div className="col-xs-4">
                            {modelPermission &&
                                <Link to={`${this.props.linkStart}/form/${this.props.instanceID}`} aria-label={`Edit ${this.props.title}`}>
                                    <i className="fa fa-pencil-square link-icon col-xs-4 col-sm-3" aria-hidden="true" />
                                    <div className="col-xs-7 col-sm-8 link-label">
                                        Edit
                                    </div>
                                </Link>
                            }
                        </div>
                        {this.props.uniqueReport &&
                            <div className="col-xs-4">
                                {modelPermission &&
                                    <Link to={`${this.props.linkStart}/report/${this.props.instanceID}`} aria-label={`${this.props.title} Report`}>
                                        <i className="fa fa-line-chart link-icon col-xs-4 col-sm-3" aria-hidden="true" />
                                        <div className="col-xs-7 col-sm-8 link-label">
                                            Report
                                        </div>
                                    </Link>
                                }
                            </div>
                        }
                        <div className="col-xs-4 ">
                            <Link to={`${this.props.linkStart}/summary/${this.props.instanceID}`} aria-label={`${this.props.title} Summary`}>
                                <i className="fa fa-file-text link-icon col-xs-4 col-sm-3" aria-hidden="true" />
                                <div className="col-xs-7 col-sm-8 link-label">
                                    Summary
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ExistingPageLinks.propTypes = {
    currentUser: PropTypes.object,
    linkStart: PropTypes.string,
    approval: PropTypes.bool,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    instanceID: PropTypes.number,
    permissionModel: PropTypes.string,
    uniqueReport: PropTypes.bool,
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
    };
}

export default connect(mapStateToProps)(ExistingPageLinks);
