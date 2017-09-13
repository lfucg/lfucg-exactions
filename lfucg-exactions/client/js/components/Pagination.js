import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPagination } from '../actions/apiActions';

class Pagination extends React.Component {

    render() {
        if (window.scrollY > 200) {
            window.scroll(0, 0);
        }
        const {
            onPaginationChangePage,
            activeForm,
        } = this.props;

        // relates to pagination size in backend
        const paginationSize = 10;

        return (
            <div className="row">
                <div className="col-xs-12 text-center">
                    <ul className="pagination">
                        <li><button aria-label="previous" className="btn btn-default" disabled={!activeForm.prev || activeForm.query} onClick={() => onPaginationChangePage(activeForm.prev)}><i className="fa fa-angle-double-left" aria-hidden="true" /></button></li>
                        <li>&nbsp;Page {activeForm.next ? (activeForm.next.charAt(activeForm.next.indexOf('=') + 1) - 1) : (Math.ceil(activeForm.count / paginationSize)) }&nbsp;</li>
                        <li><button aria-label="next" className="btn btn-default" disabled={!activeForm.next || activeForm.query} onClick={() => onPaginationChangePage(activeForm.next)}><i className="fa fa-angle-double-right" aria-hidden="true" /></button></li>
                    </ul>
                </div>
            </div>
        );
    }
}

Pagination.propTypes = {
    onPaginationChangePage: PropTypes.func,
    activeForm: PropTypes.object,
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
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Pagination);
