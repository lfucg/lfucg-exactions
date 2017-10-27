import React from 'react';
import { connect } from 'react-redux';


class FlashMessage extends React.Component {
    static propTypes = {
        flashMessage: React.PropTypes.object,
    };

    render() {
        const {
            flashMessage,
        } = this.props;

        const {
            message,
        } = flashMessage;

        const flashClass = `flash-message alert alert-dismissable fade in text-center alert-${flashMessage.messageType}`;

        if (flashMessage.message) {
            return (
                <div className={flashClass} data-dismiss="alert">
                    {message}
                </div>
            );
        }
        return null;
    }
}

function mapState(state) {
    return {
        flashMessage: state.flashMessage,
    };
}

export default connect(mapState)(FlashMessage);
