import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAccounts } from '../actions/apiActions';

class Pagination extends React.Component {
    componentDidMount() {
        this.props.onComponentDidMount();
    }

    render() {
        const {
            accounts,
            onPaginationChangePage,
        } = this.props;

        return (
            <div className="row">
                <div className="col-xs-12 text-center">
                    <ul className="pagination">
                        <li><button className="btn btn-default" disabled={!accounts.prev} onClick={() => onPaginationChangePage(accounts.prev)}>&laquo;</button></li>
                        <li><button className="btn btn-default">
                            {accounts.next ? (accounts.next.charAt(accounts.next.length - 1) - 1) : (accounts.count)}
                        </button></li>
                        <li><button className="btn btn-default" disabled={!accounts.next} onClick={() => onPaginationChangePage(accounts.next)}>&raquo;</button></li>
                    </ul>
                </div>
            </div>
        );
    }
}

Pagination.propTypes = {
    accounts: PropTypes.object,
    onComponentDidMount: PropTypes.func,
    onPaginationChangePage: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        accounts: state.accounts,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount() {
            dispatch(getAccounts());
        },
        onPaginationChangePage(field) {
            dispatch(getAccounts(field));
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Pagination);
