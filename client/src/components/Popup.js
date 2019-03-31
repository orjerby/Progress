import React from 'react'
import { Modal } from 'react-bootstrap'

class Popup extends React.Component {

    handleClose = () => {
        this.props.handleClose()
    }

    render() {
        return (
            <>
                <Modal show={true} onHide={this.handleClose}>
                    {this.props.children}
                </Modal>
            </>
        );
    }
}

export default Popup