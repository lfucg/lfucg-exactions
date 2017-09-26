import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPagination } from '../actions/apiActions';
import { formUpdate } from '../actions/formActions';

class Pagination extends React.Component {

    render() {
        if (window.pageYOffset > 200) {
            window.scroll(0, 0);
        }
        const {
            onPaginationChangePage,
            activeForm,
            changePageSize,
        } = this.props;

        // relates to pagination size in backend
        const paginationSize = 10;

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xs-12 text-center">
                        <ul className="pagination">
                            <li><button aria-label="previous" className="btn btn-default" disabled={!activeForm.prev} onClick={() => onPaginationChangePage(activeForm.prev)}><i className="fa fa-angle-double-left" aria-hidden="true" /></button></li>
                            <li>&nbsp;Page {activeForm.next ? (activeForm.next.charAt(activeForm.next.indexOf('=') + 1) - 1) : (Math.ceil(activeForm.count / paginationSize)) }&nbsp;</li>
                            <li><button aria-label="next" className="btn btn-default" disabled={!activeForm.next} onClick={() => onPaginationChangePage(activeForm.next)}><i className="fa fa-angle-double-right" aria-hidden="true" /></button></li>
                        </ul>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-4 col-xs-offset-4 text-center">
                        <div className="col-xs-3 text-center">
                            <button
                              aria-label="changePageSize"
                              className="btn btn-default"
                              value="1"
                              onClick={changePageSize}
                            >
                            10
                            </button>
                        </div>
                        <div className="col-xs-3 text-center">
                            <button
                              aria-label="changePageSize"
                              className="btn btn-default"
                              value="2"
                              onClick={changePageSize}
                            >
                            25
                            </button>
                        </div>
                        <div className="col-xs-3 text-center">
                            <button
                              aria-label="changePageSize"
                              className="btn btn-default"
                              value="4"
                              onClick={changePageSize}
                            >
                            50
                            </button>
                        </div>
                        <div className="col-xs-3 text-center">
                            <button
                              aria-label="changePageSize"
                              className="btn btn-default"
                              value="9999"
                              onClick={changePageSize}
                            >
                            All
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Pagination.propTypes = {
    onPaginationChangePage: PropTypes.func,
    activeForm: PropTypes.object,
    changePageSize: PropTypes.func,
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
            dispatch(formUpdate({ filter_size: value }));
            dispatch(getPagination());
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Pagination);
