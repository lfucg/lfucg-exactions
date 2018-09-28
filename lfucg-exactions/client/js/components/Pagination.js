import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPagination } from '../actions/apiActions';
import { formUpdate } from '../actions/formActions';

class Pagination extends React.Component {

    render() {
        if (window.pageYOffset > 250) {
            window.scroll(0, 0);
        }
  
        const {
            onPaginationChangePage,
            activeForm,
            changePageSize,
        } = this.props;

        // relates to pagination size in backend
        const paginationSize = activeForm.page_size || 10;

        
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xs-12 text-center">
                        <ul className="pagination">
                            <li>
                                <button 
                                    aria-label="previous" 
                                    className="btn btn-default" 
                                    disabled={!this.props.prev} 
                                    onClick={() => onPaginationChangePage(this.props.prev)}
                                >
                                    <i className="fa fa-angle-double-left" aria-hidden="true" />
                                </button>
                            </li>
                            <li>
                                &nbsp;Page {this.props.next ? (
                                    this.props.next.charAt(this.props.next.indexOf('page=') + 5) - 1
                                ) : (
                                    Math.ceil(this.props.count / paginationSize)
                                ) }&nbsp;</li>
                            <li>
                                <button 
                                    aria-label="next" 
                                    className="btn btn-default" 
                                    disabled={!this.props.next} 
                                    onClick={() => onPaginationChangePage(this.props.next)}
                                >
                                    <i className="fa fa-angle-double-right" aria-hidden="true" />
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                {this.props.count > 10 &&
                    <div>
                        <div className="row">
                            <div className="col-xs-12 col-sm-4 col-sm-offset-4 text-center">Results per page</div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 col-sm-4 col-sm-offset-4 text-center">
                                <button
                                  aria-label="Change Page Size"
                                  className="btn btn-link"
                                  value="10"
                                  onClick={changePageSize}
                                >
                                10
                                </button>
                                <button
                                  aria-label="Change Page Size"
                                  className="btn btn-link"
                                  value="25"
                                  onClick={changePageSize}
                                >
                                25
                                </button>
                                <button
                                  aria-label="Change Page Size"
                                  className="btn btn-link"
                                  value="50"
                                  onClick={changePageSize}
                                >
                                50
                                </button>
                                <button
                                  aria-label="Change Page Size"
                                  className="btn btn-link"
                                  value="9999"
                                  onClick={changePageSize}
                                >
                                All
                                </button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

Pagination.propTypes = {
    onPaginationChangePage: PropTypes.func,
    activeForm: PropTypes.object,
    changePageSize: PropTypes.func,
    next: PropTypes.string,
    prev: PropTypes.string,
    count: PropTypes.number,
};

function mapStateToProps(state) {
    return {
        activeForm: state.activeForm,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onPaginationChangePage(field) {
            dispatch(getPagination(field));
        },
        changePageSize(e) {
            const value = e.target.value;
            dispatch(formUpdate({ page_size: value }));
            dispatch(getPagination(null));
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Pagination);
