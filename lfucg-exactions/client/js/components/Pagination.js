import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPagination } from '../actions/apiActions';
import { formUpdate } from '../actions/formActions';

class Pagination extends React.Component {

    render() {
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
                        <li><button className="btn btn-default" disabled={!activeForm.prev || activeForm.query} onClick={() => onPaginationChangePage(activeForm.prev)}>&laquo;</button></li>
                        <li>
                            <button className="btn btn-default">
                                {activeForm.next ? (activeForm.next.charAt(activeForm.next.indexOf('=') + 1) - 1) : (Math.ceil(activeForm.count / paginationSize)) }
                            </button>
                        </li>
                        <li><button className="btn btn-default" disabled={!activeForm.next || activeForm.query} onClick={() => onPaginationChangePage(activeForm.next)}>&raquo;</button></li>
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
            dispatch(getPagination(field))
            .then((data) => {
                const update = {
                    next: data.response.next,
                    prev: data.response.prev,
                    count: data.response.count,
                };
                dispatch(formUpdate(update));
            });
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Pagination);
